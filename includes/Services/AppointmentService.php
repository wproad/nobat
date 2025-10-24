<?php
/**
 * Appointment Service
 * 
 * Handles business logic for appointments
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Services;

use Nobat\Repositories\AppointmentRepository;
use Nobat\Repositories\SlotRepository;
use Nobat\Repositories\AppointmentHistoryRepository;
use Nobat\Core\DatabaseTransaction;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Appointment Service class
 */
class AppointmentService {
	
	/**
	 * Maximum active appointments per user
	 */
	const MAX_ACTIVE_APPOINTMENTS = 3;
	
	/**
	 * Appointment repository
	 * 
	 * @var AppointmentRepository
	 */
	private $appointment_repo;
	
	/**
	 * Slot repository
	 * 
	 * @var SlotRepository
	 */
	private $slot_repo;
	
	/**
	 * History repository
	 * 
	 * @var AppointmentHistoryRepository
	 */
	private $history_repo;
	
	/**
	 * Transaction handler
	 * 
	 * @var DatabaseTransaction
	 */
	private $transaction;
	
	/**
	 * Constructor
	 * 
	 * @param AppointmentRepository|null $appointment_repo
	 * @param SlotRepository|null $slot_repo
	 * @param AppointmentHistoryRepository|null $history_repo
	 * @param DatabaseTransaction|null $transaction
	 */
	public function __construct( $appointment_repo = null, $slot_repo = null, $history_repo = null, $transaction = null ) {
		$this->appointment_repo = $appointment_repo ?: new AppointmentRepository();
		$this->slot_repo = $slot_repo ?: new SlotRepository();
		$this->history_repo = $history_repo ?: new AppointmentHistoryRepository();
		$this->transaction = $transaction ?: new DatabaseTransaction();
	}
	
	/**
	 * Check if user can book more appointments
	 * 
	 * @param int $user_id
	 * @return bool
	 */
	public function can_user_book_appointment( $user_id ) {
		$active_count = $this->appointment_repo->count_active_by_user( $user_id );
		return $active_count < self::MAX_ACTIVE_APPOINTMENTS;
	}
	
	/**
	 * Get user's active appointment count
	 * 
	 * @param int $user_id
	 * @return int
	 */
	public function get_user_active_count( $user_id ) {
		return $this->appointment_repo->count_active_by_user( $user_id );
	}
	
	/**
	 * Book an appointment
	 * 
	 * @param int $user_id
	 * @param int $slot_id
	 * @param int $schedule_id
	 * @param string|null $note
	 * @return array|WP_Error Appointment data or error
	 */
	public function book_appointment( $user_id, $slot_id, $schedule_id, $note = null ) {
		try {
			// Check if user can book more appointments
			if ( ! $this->can_user_book_appointment( $user_id ) ) {
				return new \WP_Error(
					'max_appointments_reached',
					sprintf(
						__( 'You have reached the maximum of %d active appointments. Please cancel or complete an existing appointment before booking a new one.', 'nobat' ),
						self::MAX_ACTIVE_APPOINTMENTS
					),
					array( 'status' => 400 )
				);
			}
			
			// Execute booking in transaction
			$result = $this->transaction->execute( function() use ( $user_id, $slot_id, $schedule_id, $note ) {
				// Check if slot is available
				if ( ! $this->slot_repo->is_available( $slot_id ) ) {
					throw new \Exception( __( 'This time slot is no longer available.', 'nobat' ) );
				}
				
				// Check if user already has this slot booked
				if ( $this->appointment_repo->user_has_slot_booked( $user_id, $slot_id ) ) {
					throw new \Exception( __( 'You have already booked this time slot.', 'nobat' ) );
				}
				
				// Mark slot as booked
				if ( ! $this->slot_repo->mark_as_booked( $slot_id ) ) {
					throw new \Exception( __( 'Failed to reserve the time slot.', 'nobat' ) );
				}
				
				// Create appointment
				$appointment_id = $this->appointment_repo->insert( array(
					'user_id' => $user_id,
					'slot_id' => $slot_id,
					'schedule_id' => $schedule_id,
					'note' => $note,
					'status' => 'pending'
				) );
				
				if ( ! $appointment_id ) {
					throw new \Exception( __( 'Failed to create appointment.', 'nobat' ) );
				}
				
				// Add history entry
				$this->history_repo->add_entry(
					$appointment_id,
					$user_id,
					'created',
					__( 'Appointment created', 'nobat' )
				);
				
				return $appointment_id;
			} );
			
			// Get appointment details
			$appointment = $this->appointment_repo->get_with_details( $result );
			
			return $appointment;
			
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'booking_failed',
				$e->getMessage(),
				array( 'status' => 400 )
			);
		}
	}
	
	/**
	 * Request appointment cancellation (user action)
	 * 
	 * @param int $appointment_id
	 * @param int $user_id
	 * @param string|null $reason
	 * @return bool|WP_Error
	 */
	public function request_cancellation( $appointment_id, $user_id, $reason = null ) {
		$appointment = $this->appointment_repo->find( $appointment_id );
		
		if ( ! $appointment ) {
			return new \WP_Error( 'not_found', __( 'Appointment not found.', 'nobat' ), array( 'status' => 404 ) );
		}
		
		// Verify ownership
		if ( (int) $appointment['user_id'] !== (int) $user_id ) {
			return new \WP_Error( 'unauthorized', __( 'You cannot cancel this appointment.', 'nobat' ), array( 'status' => 403 ) );
		}
		
		// Check if appointment can be cancelled
		if ( ! in_array( $appointment['status'], array( 'pending', 'confirmed' ), true ) ) {
			return new \WP_Error( 'invalid_status', __( 'This appointment cannot be cancelled.', 'nobat' ), array( 'status' => 400 ) );
		}
		
		// Update status to cancel_requested
		$success = $this->appointment_repo->update_status( $appointment_id, 'cancel_requested' );
		
		if ( ! $success ) {
			return new \WP_Error( 'update_failed', __( 'Failed to request cancellation.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		// Update cancellation reason if provided
		if ( $reason ) {
			$this->appointment_repo->update( $appointment_id, array( 'cancellation_reason' => $reason ) );
		}
		
		// Add history entry
		$this->history_repo->add_entry(
			$appointment_id,
			$user_id,
			'cancel_requested',
			$reason ? sprintf( __( 'Cancellation requested: %s', 'nobat' ), $reason ) : __( 'Cancellation requested', 'nobat' )
		);
		
		return true;
	}
	
	/**
	 * Confirm appointment (admin action)
	 * 
	 * @param int $appointment_id
	 * @param int $admin_id
	 * @return bool|WP_Error
	 */
	public function confirm_appointment( $appointment_id, $admin_id ) {
		$appointment = $this->appointment_repo->find( $appointment_id );
		
		if ( ! $appointment ) {
			return new \WP_Error( 'not_found', __( 'Appointment not found.', 'nobat' ), array( 'status' => 404 ) );
		}
		
		if ( $appointment['status'] !== 'pending' ) {
			return new \WP_Error( 'invalid_status', __( 'Only pending appointments can be confirmed.', 'nobat' ), array( 'status' => 400 ) );
		}
		
		$success = $this->appointment_repo->update_status( $appointment_id, 'confirmed' );
		
		if ( ! $success ) {
			return new \WP_Error( 'update_failed', __( 'Failed to confirm appointment.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		// Add history entry
		$this->history_repo->add_entry(
			$appointment_id,
			$admin_id,
			'confirmed',
			__( 'Appointment confirmed by admin', 'nobat' )
		);
		
		return true;
	}
	
	/**
	 * Complete appointment (admin action)
	 * 
	 * @param int $appointment_id
	 * @param int $admin_id
	 * @return bool|WP_Error
	 */
	public function complete_appointment( $appointment_id, $admin_id ) {
		$appointment = $this->appointment_repo->find( $appointment_id );
		
		if ( ! $appointment ) {
			return new \WP_Error( 'not_found', __( 'Appointment not found.', 'nobat' ), array( 'status' => 404 ) );
		}
		
		if ( ! in_array( $appointment['status'], array( 'pending', 'confirmed' ), true ) ) {
			return new \WP_Error( 'invalid_status', __( 'This appointment cannot be marked as completed.', 'nobat' ), array( 'status' => 400 ) );
		}
		
		$success = $this->appointment_repo->update_status( $appointment_id, 'completed', $admin_id );
		
		if ( ! $success ) {
			return new \WP_Error( 'update_failed', __( 'Failed to complete appointment.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		// Add history entry
		$this->history_repo->add_entry(
			$appointment_id,
			$admin_id,
			'completed',
			__( 'Appointment completed by admin', 'nobat' )
		);
		
		return true;
	}
	
	/**
	 * Cancel appointment (admin action)
	 * 
	 * @param int $appointment_id
	 * @param int $admin_id
	 * @param string|null $reason
	 * @return bool|WP_Error
	 */
	public function cancel_appointment( $appointment_id, $admin_id, $reason = null ) {
		try {
			return $this->transaction->execute( function() use ( $appointment_id, $admin_id, $reason ) {
				$appointment = $this->appointment_repo->find( $appointment_id );
				
				if ( ! $appointment ) {
					throw new \Exception( __( 'Appointment not found.', 'nobat' ) );
				}
				
				// Update status to cancelled
				$success = $this->appointment_repo->update_status( $appointment_id, 'cancelled' );
				
				if ( ! $success ) {
					throw new \Exception( __( 'Failed to cancel appointment.', 'nobat' ) );
				}
				
				// Update cancellation reason if provided
				if ( $reason ) {
					$this->appointment_repo->update( $appointment_id, array( 'cancellation_reason' => $reason ) );
				}
				
					// Mark slot as available again
				$slot_updated = $this->slot_repo->mark_as_available( $appointment['slot_id'] );
				error_log( sprintf( 
					'[Nobat] Appointment #%d cancelled. Slot #%d status updated to available: %s', 
					$appointment_id, 
					$appointment['slot_id'],
					$slot_updated ? 'SUCCESS' : 'FAILED'
				) );
				
				// Add history entry
				$this->history_repo->add_entry(
					$appointment_id,
					$admin_id,
					'cancelled',
					$reason ? sprintf( __( 'Cancelled by admin: %s', 'nobat' ), $reason ) : __( 'Cancelled by admin', 'nobat' )
				);
				
				return true;
			} );
			
		} catch ( \Exception $e ) {
			return new \WP_Error( 'cancellation_failed', $e->getMessage(), array( 'status' => 500 ) );
		}
	}
	
	/**
	 * Restore appointment (admin action) - restore cancelled/completed to confirmed
	 * 
	 * @param int $appointment_id
	 * @param int $admin_id
	 * @return bool|WP_Error
	 */
	public function restore_appointment( $appointment_id, $admin_id ) {
		try {
			return $this->transaction->execute( function() use ( $appointment_id, $admin_id ) {
				$appointment = $this->appointment_repo->find( $appointment_id );
				
				if ( ! $appointment ) {
					throw new \Exception( __( 'Appointment not found.', 'nobat' ) );
				}
				
				// Can only restore cancelled or completed appointments
				if ( ! in_array( $appointment['status'], array( 'cancelled', 'completed' ), true ) ) {
					throw new \Exception( __( 'Only cancelled or completed appointments can be restored.', 'nobat' ) );
				}
				
				// Update status to confirmed
				$success = $this->appointment_repo->update_status( $appointment_id, 'confirmed' );
				
				if ( ! $success ) {
					throw new \Exception( __( 'Failed to restore appointment.', 'nobat' ) );
				}
				
				// If it was cancelled, mark slot as booked again
				if ( $appointment['status'] === 'cancelled' ) {
					$this->slot_repo->mark_as_booked( $appointment['slot_id'] );
				}
				
				// Add history entry
				$this->history_repo->add_entry(
					$appointment_id,
					$admin_id,
					'confirmed',
					__( 'Appointment restored to confirmed by admin', 'nobat' )
				);
				
				return true;
			} );
			
		} catch ( \Exception $e ) {
			return new \WP_Error( 'restore_failed', $e->getMessage(), array( 'status' => 500 ) );
		}
	}
	
	/**
	 * Update appointment report
	 *
	 * @param int $appointment_id
	 * @param string $report
	 * @return bool|\WP_Error
	 */
	public function update_appointment_report( $appointment_id, $report ) {
		$success = $this->appointment_repo->update( $appointment_id, array( 'report' => $report ) );
		
		if ( ! $success ) {
			return new \WP_Error( 'update_failed', __( 'Failed to update report.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		return true;
	}
	
	/**
	 * Get user appointments
	 * 
	 * @param int $user_id
	 * @param array $args
	 * @return array
	 */
	public function get_user_appointments( $user_id, $args = array() ) {
		return $this->appointment_repo->find_by_user( $user_id, $args );
	}
	
	/**
	 * Get all appointments with filters
	 * 
	 * @param array $args
	 * @return array
	 */
	public function get_all_appointments( $args = array() ) {
		return $this->appointment_repo->find_all_with_details( $args );
	}
	
	/**
	 * Get cancellation requests
	 * 
	 * @return array
	 */
	public function get_cancellation_requests() {
		return $this->appointment_repo->find_cancellation_requests();
	}
	
	/**
	 * Get appointment by ID
	 * 
	 * @param int $appointment_id
	 * @return array|null
	 */
	public function get_appointment( $appointment_id ) {
		return $this->appointment_repo->get_with_details( $appointment_id );
	}
	
	/**
	 * Get appointment history
	 * 
	 * @param int $appointment_id
	 * @return array
	 */
	public function get_appointment_history( $appointment_id ) {
		return $this->history_repo->find_by_appointment( $appointment_id );
	}
}

