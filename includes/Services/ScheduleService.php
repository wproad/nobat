<?php
/**
 * Schedule Service
 * 
 * Handles business logic for schedules
 * 
 * @package Nobat
 * @since 2.0.0
 */
namespace Nobat\Services;

use Nobat\Repositories\ScheduleRepository;
use Nobat\Repositories\WorkingHoursRepository;
use Nobat\Repositories\SlotRepository;
use Nobat\Repositories\AppointmentRepository;
use Nobat\Repositories\AppointmentHistoryRepository;
use Nobat\Core\DatabaseTransaction;
use Nobat\Utilities\SlotGenerator;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Schedule Service class
 */
class ScheduleService {
	
	/**
	 * @var ScheduleRepository
	 */
	private $schedule_repo;
	
	/**
	 * @var WorkingHoursRepository
	 */
	private $working_hours_repo;
	
	/**
	 * @var SlotRepository
	 */
	private $slot_repo;

	/**
	 * @var AppointmentRepository
	 */
	private $appointment_repo;

	/**
	 * @var AppointmentHistoryRepository
	 */
	private $history_repo;

	/**
	 * @var AppointmentService|null
	 */
	private $appointment_service;
	
	/**
	 * @var DatabaseTransaction
	 */
	private $transaction;
	
	/**
	 * Constructor
	 *
	 * @param ScheduleRepository|null $schedule_repo
	 * @param WorkingHoursRepository|null $working_hours_repo
	 * @param SlotRepository|null $slot_repo
	 * @param DatabaseTransaction|null $transaction
	 * @param AppointmentRepository|null $appointment_repo
	 * @param AppointmentHistoryRepository|null $history_repo
	 * @param AppointmentService|null $appointment_service
	 */
	public function __construct(
		$schedule_repo = null,
		$working_hours_repo = null,
		$slot_repo = null,
		$transaction = null,
		$appointment_repo = null,
		$history_repo = null,
		$appointment_service = null
	) {
		$this->schedule_repo = $schedule_repo ?: new ScheduleRepository();
		$this->working_hours_repo = $working_hours_repo ?: new WorkingHoursRepository();
		$this->slot_repo = $slot_repo ?: new SlotRepository();
		$this->transaction = $transaction ?: new DatabaseTransaction();
		$this->appointment_repo = $appointment_repo ?: new AppointmentRepository();
		$this->history_repo = $history_repo ?: new AppointmentHistoryRepository();
		$this->appointment_service = $appointment_service;
	}

	/**
	 * Lazy-resolve appointment service to avoid circular DI issues when constructed manually.
	 *
	 * @return AppointmentService
	 */
	private function get_appointment_service() {
		if ( ! $this->appointment_service ) {
			$this->appointment_service = function_exists( 'nobat_service' )
				? nobat_service( 'appointment_service' )
				: new AppointmentService();
		}
		return $this->appointment_service;
	}
	
	/**
	 * Create a new schedule with working hours and slots.
	 * New schedules are always created inactive.
	 * 
	 * @param array $data Schedule data
	 * @return array|WP_Error Schedule or error
	 */
	public function create_schedule( $data ) {
		try {
			$result = $this->transaction->execute( function() use ( $data ) {
				$schedule_id = $this->schedule_repo->insert( array(
					'name' => $data['name'],
					'is_active' => 0,
					'start_date' => $data['start_date'],
					'end_date' => $data['end_date'],
					'meeting_duration' => $data['meeting_duration'],
					'buffer_time' => isset( $data['buffer_time'] ) ? $data['buffer_time'] : 0
				) );
				
				if ( ! $schedule_id ) {
					throw new \Exception( __( 'Failed to create schedule.', 'nobat' ) );
				}
				
				if ( ! empty( $data['working_hours'] ) ) {
					$working_hours = $this->prepare_working_hours( $schedule_id, $data['working_hours'] );
					
					if ( ! $this->working_hours_repo->insert_multiple( $working_hours ) ) {
						throw new \Exception( __( 'Failed to save working hours.', 'nobat' ) );
					}
				}
				
				$slots = $this->generate_slots(
					$schedule_id,
					$data['start_date'],
					$data['end_date'],
					$data['working_hours'],
					$data['meeting_duration'],
					isset( $data['buffer_time'] ) ? $data['buffer_time'] : 0
				);
				
				if ( ! empty( $slots ) ) {
					if ( ! $this->slot_repo->insert_multiple( $slots ) ) {
						throw new \Exception( __( 'Failed to generate time slots.', 'nobat' ) );
					}
				}
				
				return $schedule_id;
			} );
			
			return $this->schedule_repo->get_with_working_hours( $result );
			
		} catch ( \Exception $e ) {
			return new WP_Error(
				'create_failed',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}
	
	/**
	 * Generate slots from working hours
	 * 
	 * @param int $schedule_id
	 * @param string $start_date
	 * @param string $end_date
	 * @param array $working_hours
	 * @param int $meeting_duration
	 * @param int $buffer_time
	 * @return array
	 */
	private function generate_slots( $schedule_id, $start_date, $end_date, $working_hours, $meeting_duration, $buffer_time ) {
		return SlotGenerator::generate_slots_from_working_hours(
			$schedule_id,
			$working_hours,
			$start_date,
			$end_date,
			$meeting_duration,
			$buffer_time
		);
	}
	
	/**
	 * Prepare working hours array for insertion
	 * 
	 * @param int $schedule_id
	 * @param array $working_hours
	 * @return array
	 */
	private function prepare_working_hours( $schedule_id, $working_hours ) {
		$prepared = array();
		
		foreach ( $working_hours as $hour ) {
			$prepared[] = array(
				'schedule_id' => $schedule_id,
				'day_of_week' => $hour['day_of_week'],
				'start_time' => $hour['start_time'],
				'end_time' => $hour['end_time']
			);
		}
		
		return $prepared;
	}
	
	/**
	 * Get active schedule (latest by id)
	 * 
	 * @return array|null
	 */
	public function get_active_schedule() {
		$schedule = $this->schedule_repo->find_active();
		
		if ( ! $schedule ) {
			return null;
		}
		
		return $this->get_schedule( $schedule['id'] );
	}
	
	/**
	 * Get all schedules
	 * 
	 * @return array
	 */
	public function get_all_schedules() {
		return $this->schedule_repo->find_all( array(
			'orderby' => 'created_at',
			'order' => 'DESC'
		) );
	}
	
	/**
	 * Get schedule by ID
	 * 
	 * @param int $schedule_id
	 * @return array|null
	 */
	public function get_schedule( $schedule_id ) {
		$schedule = $this->schedule_repo->get_with_working_hours( $schedule_id );
		
		if ( ! $schedule ) {
			return null;
		}
		
		$timeslots = $this->slot_repo->get_grouped_by_date(
			$schedule_id,
			$schedule['start_date'],
			$schedule['end_date']
		);
		
		foreach ( $timeslots as &$day ) {
			foreach ( $day['slots'] as &$slot ) {
				$slot['start'] = substr( $slot['start_time'], 0, 5 );
				$slot['end'] = substr( $slot['end_time'], 0, 5 );
			}
		}
		
		$schedule['timeslots'] = $timeslots;
		
		return $schedule;
	}

	/**
	 * Update schedule name and/or is_active.
	 * Deactivating cancels open appointments on the schedule.
	 *
	 * @param int $schedule_id
	 * @param array $data Keys: name, is_active
	 * @param int|null $admin_id
	 * @return array|WP_Error Updated schedule row or error
	 */
	public function update_schedule( $schedule_id, $data, $admin_id = null ) {
		$schedule = $this->schedule_repo->find( $schedule_id );

		if ( ! $schedule ) {
			return new WP_Error( 'not_found', __( 'Schedule not found.', 'nobat' ), array( 'status' => 404 ) );
		}

		$was_active = ! empty( $schedule['is_active'] );
		$will_deactivate = array_key_exists( 'is_active', $data )
			&& empty( $data['is_active'] )
			&& $was_active;

		if ( $will_deactivate ) {
			$admin_id = $admin_id ?: get_current_user_id();
			$cancel_result = $this->get_appointment_service()->cancel_appointments_for_schedule(
				$schedule_id,
				$admin_id,
				__( 'Schedule deactivated by admin', 'nobat' )
			);
			if ( is_wp_error( $cancel_result ) ) {
				return $cancel_result;
			}
		}

		$update = array();
		if ( array_key_exists( 'name', $data ) ) {
			$update['name'] = sanitize_text_field( $data['name'] );
		}
		if ( array_key_exists( 'is_active', $data ) ) {
			$update['is_active'] = ! empty( $data['is_active'] ) ? 1 : 0;
		}

		if ( empty( $update ) ) {
			return $schedule;
		}

		$success = $this->schedule_repo->update( $schedule_id, $update );
		if ( ! $success ) {
			return new WP_Error( 'update_failed', __( 'Failed to update schedule.', 'nobat' ), array( 'status' => 500 ) );
		}

		return $this->schedule_repo->find( $schedule_id );
	}
	
	/**
	 * Activate a schedule (does not deactivate others)
	 * 
	 * @param int $schedule_id
	 * @return bool|WP_Error
	 */
	public function activate_schedule( $schedule_id ) {
		$schedule = $this->schedule_repo->find( $schedule_id );
		
		if ( ! $schedule ) {
			return new WP_Error( 'not_found', __( 'Schedule not found.', 'nobat' ), array( 'status' => 404 ) );
		}
		
		$success = $this->schedule_repo->activate( $schedule_id );
		
		if ( ! $success ) {
			return new WP_Error( 'activation_failed', __( 'Failed to activate schedule.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		return true;
	}

	/**
	 * Deactivate a schedule and cancel its open appointments
	 *
	 * @param int $schedule_id
	 * @param int|null $admin_id
	 * @return bool|WP_Error
	 */
	public function deactivate_schedule( $schedule_id, $admin_id = null ) {
		$result = $this->update_schedule(
			$schedule_id,
			array( 'is_active' => 0 ),
			$admin_id
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return true;
	}
	
	/**
	 * Delete a schedule and all related appointments, slots, and working hours
	 * 
	 * @param int $schedule_id
	 * @return bool|WP_Error
	 */
	public function delete_schedule( $schedule_id ) {
		$schedule = $this->schedule_repo->find( $schedule_id );
		
		if ( ! $schedule ) {
			return new WP_Error( 'not_found', __( 'Schedule not found.', 'nobat' ), array( 'status' => 404 ) );
		}

		try {
			$this->transaction->execute( function() use ( $schedule_id ) {
				$appointment_ids = $this->appointment_repo->get_ids_by_schedule( $schedule_id );

				if ( ! empty( $appointment_ids ) ) {
					if ( ! $this->history_repo->delete_by_appointment_ids( $appointment_ids ) ) {
						throw new \Exception( __( 'Failed to delete appointment history.', 'nobat' ) );
					}
					if ( ! $this->appointment_repo->delete_by_schedule( $schedule_id ) ) {
						throw new \Exception( __( 'Failed to delete appointments.', 'nobat' ) );
					}
				}

				if ( ! $this->slot_repo->delete_by_schedule( $schedule_id ) ) {
					throw new \Exception( __( 'Failed to delete slots.', 'nobat' ) );
				}

				if ( ! $this->working_hours_repo->delete_by_schedule( $schedule_id ) ) {
					throw new \Exception( __( 'Failed to delete working hours.', 'nobat' ) );
				}

				if ( ! $this->schedule_repo->delete( $schedule_id ) ) {
					throw new \Exception( __( 'Failed to delete schedule.', 'nobat' ) );
				}

				return true;
			} );

			return true;
		} catch ( \Exception $e ) {
			return new WP_Error(
				'delete_failed',
				$e->getMessage(),
				array( 'status' => 500 )
			);
		}
	}
}
