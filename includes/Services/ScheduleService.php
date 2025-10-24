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
use Nobat\Core\DatabaseTransaction;
use Nobat\Utilities\SlotGenerator;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Schedule Service class
 */
class ScheduleService {
	
	/**
	 * Schedule repository
	 * 
	 * @var ScheduleRepository
	 */
	private $schedule_repo;
	
	/**
	 * Working hours repository
	 * 
	 * @var WorkingHoursRepository
	 */
	private $working_hours_repo;
	
	/**
	 * Slot repository
	 * 
	 * @var SlotRepository
	 */
	private $slot_repo;
	
	/**
	 * Transaction handler
	 * 
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
	 */
	public function __construct( $schedule_repo = null, $working_hours_repo = null, $slot_repo = null, $transaction = null ) {
		$this->schedule_repo = $schedule_repo ?: new ScheduleRepository();
		$this->working_hours_repo = $working_hours_repo ?: new WorkingHoursRepository();
		$this->slot_repo = $slot_repo ?: new SlotRepository();
		$this->transaction = $transaction ?: new DatabaseTransaction();
	}
	
	/**
	 * Create a new schedule with working hours and slots
	 * 
	 * @param array $data Schedule data
	 * @return array|WP_Error Schedule or error
	 */
	public function create_schedule( $data ) {
		try {
			$result = $this->transaction->execute( function() use ( $data ) {
				// Insert schedule (Gregorian dates only)
				$schedule_id = $this->schedule_repo->insert( array(
					'name' => $data['name'],
					'is_active' => isset( $data['is_active'] ) ? $data['is_active'] : 0,
					'start_date' => $data['start_date'],
					'end_date' => $data['end_date'],
					'meeting_duration' => $data['meeting_duration'],
					'buffer_time' => isset( $data['buffer_time'] ) ? $data['buffer_time'] : 0
				) );
				
				if ( ! $schedule_id ) {
					throw new \Exception( __( 'Failed to create schedule.', 'nobat' ) );
				}
				
				// Insert working hours
				if ( ! empty( $data['working_hours'] ) ) {
					$working_hours = $this->prepare_working_hours( $schedule_id, $data['working_hours'] );
					
					if ( ! $this->working_hours_repo->insert_multiple( $working_hours ) ) {
						throw new \Exception( __( 'Failed to save working hours.', 'nobat' ) );
					}
				}
				
				// Generate and insert slots
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
				
				// If set as active, deactivate others
				if ( ! empty( $data['is_active'] ) ) {
					$this->schedule_repo->activate( $schedule_id );
				}
				
				return $schedule_id;
			} );
			
			return $this->schedule_repo->get_with_working_hours( $result );
			
		} catch ( Exception $e ) {
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
	 * Get active schedule
	 * 
	 * @return array|null
	 */
	public function get_active_schedule() {
		$schedule = $this->schedule_repo->find_active();
		
		if ( ! $schedule ) {
			return null;
		}
		
		// Use get_schedule to include timeslots
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
		
		// Get slots grouped by date for the schedule's date range
		$timeslots = $this->slot_repo->get_grouped_by_date(
			$schedule_id,
			$schedule['start_date'],
			$schedule['end_date']
		);
		
		// Format slots for frontend (remove seconds from times)
		foreach ( $timeslots as &$day ) {
			foreach ( $day['slots'] as &$slot ) {
				// Convert HH:MM:SS to HH:MM
				$slot['start'] = substr( $slot['start_time'], 0, 5 );
				$slot['end'] = substr( $slot['end_time'], 0, 5 );
			}
		}
		
		$schedule['timeslots'] = $timeslots;
		
		return $schedule;
	}
	
	/**
	 * Activate a schedule
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
	 * Delete a schedule
	 * 
	 * @param int $schedule_id
	 * @return bool|WP_Error
	 */
	public function delete_schedule( $schedule_id ) {
		$schedule = $this->schedule_repo->find( $schedule_id );
		
		if ( ! $schedule ) {
			return new WP_Error( 'not_found', __( 'Schedule not found.', 'nobat' ), array( 'status' => 404 ) );
		}
		
		// Check if schedule has appointments
		// This will be enforced by foreign key constraints
		
		$success = $this->schedule_repo->delete( $schedule_id );
		
		if ( ! $success ) {
			return new WP_Error( 'delete_failed', __( 'Failed to delete schedule.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		return true;
	}
}

