<?php
/**
 * Appointment Controller
 * 
 * Handles REST API requests for appointments
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Controllers;

use Nobat\Services\AppointmentService;
use Nobat\Services\AuthService;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Appointment Controller class
 */
class AppointmentController {
	
	/**
	 * Appointment service
	 * 
	 * @var AppointmentService
	 */
	private $appointment_service;
	
	/**
	 * Auth service
	 * 
	 * @var AuthService
	 */
	private $auth_service;
	
	/**
	 * Constructor
	 * 
	 * @param AppointmentService|null $appointment_service
	 * @param AuthService|null $auth_service
	 */
	public function __construct( $appointment_service = null, $auth_service = null ) {
		// Use dependency injection or fallback to container
		if ( $appointment_service !== null ) {
			$this->appointment_service = $appointment_service;
		} else {
			$this->appointment_service = nobat_service( 'appointment_service' );
		}
		
		if ( $auth_service !== null ) {
			$this->auth_service = $auth_service;
		} else {
			$this->auth_service = nobat_service( 'auth_service' );
		}
	}
	
	/**
	 * Create a new appointment
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function create( $request ) {
		$user_id = $this->auth_service->get_current_user_id();
		
		// Get parameters
		$slot_id = $request->get_param( 'slot_id' );
		$schedule_id = $request->get_param( 'schedule_id' );
		$note = $request->get_param( 'note' );
		
		// Validate required parameters
		if ( ! $slot_id || ! $schedule_id ) {
			return new WP_Error(
				'missing_parameters',
				__( 'slot_id and schedule_id are required.', 'nobat' ),
				array( 'status' => 400 )
			);
		}
		
		// Book appointment
		$result = $this->appointment_service->book_appointment(
			$user_id,
			(int) $slot_id,
			(int) $schedule_id,
			$note
		);
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Appointment booked successfully!', 'nobat' ),
				'appointment' => $result
			),
			201
		);
	}
	
	/**
	 * Get user's appointments
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_my_appointments( $request ) {
		$user_id = $this->auth_service->get_current_user_id();
		
		$status = $request->get_param( 'status' );
		
		$args = array();
		if ( $status ) {
			$args['status'] = $status;
		}
		
		$appointments = $this->appointment_service->get_user_appointments( $user_id, $args );
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'appointments' => $appointments,
				'count' => count( $appointments )
			),
			200
		);
	}
	
	/**
	 * Get all appointments (admin only)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_all( $request ) {
		$status = $request->get_param( 'status' );
		$date_from = $request->get_param( 'date_from' );
		$date_to = $request->get_param( 'date_to' );
		$schedule_id = $request->get_param( 'schedule_id' );
		
		$args = array();
		
		if ( $status ) {
			$args['status'] = $status;
		}
		
		if ( $date_from ) {
			$args['date_from'] = $date_from;
		}
		
		if ( $date_to ) {
			$args['date_to'] = $date_to;
		}
		
		if ( $schedule_id ) {
			$args['schedule_id'] = (int) $schedule_id;
		}
		
		$appointments = $this->appointment_service->get_all_appointments( $args );
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'appointments' => $appointments,
				'count' => count( $appointments )
			),
			200
		);
	}
	
	/**
	 * Get single appointment
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_one( $request ) {
		$appointment_id = $request->get_param( 'id' );
		
		$appointment = $this->appointment_service->get_appointment( $appointment_id );
		
		if ( ! $appointment ) {
			return new WP_Error(
				'not_found',
				__( 'Appointment not found.', 'nobat' ),
				array( 'status' => 404 )
			);
		}
		
		// Check access
		if ( ! $this->auth_service->is_admin() ) {
			if ( (int) $appointment['user_id'] !== $this->auth_service->get_current_user_id() ) {
				return new WP_Error(
					'no_permission',
					__( 'You do not have permission to view this appointment.', 'nobat' ),
					array( 'status' => 403 )
				);
			}
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'appointment' => $appointment
			),
			200
		);
	}
	
	/**
	 * Request cancellation (user action)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function request_cancel( $request ) {
		$appointment_id = $request->get_param( 'id' );
		$reason = $request->get_param( 'reason' );
		$user_id = $this->auth_service->get_current_user_id();
		
		$result = $this->appointment_service->request_cancellation(
			$appointment_id,
			$user_id,
			$reason
		);
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Cancellation request submitted. An admin will review your request.', 'nobat' )
			),
			200
		);
	}
	
	/**
	 * Confirm appointment (admin action)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function confirm( $request ) {
		$appointment_id = $request->get_param( 'id' );
		$admin_id = $this->auth_service->get_current_user_id();
		
		$result = $this->appointment_service->confirm_appointment( $appointment_id, $admin_id );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Appointment confirmed successfully.', 'nobat' )
			),
			200
		);
	}
	
	/**
	 * Complete appointment (admin action)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function complete( $request ) {
		$appointment_id = $request->get_param( 'id' );
		$admin_id = $this->auth_service->get_current_user_id();
		
		$result = $this->appointment_service->complete_appointment( $appointment_id, $admin_id );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Appointment marked as completed.', 'nobat' )
			),
			200
		);
	}
	
	/**
	 * Update appointment status (admin action)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_status( $request ) {
		$appointment_id = $request->get_param( 'id' );
		$new_status = $request->get_param( 'status' );
		$admin_id = $this->auth_service->get_current_user_id();
		
		// Get current appointment to check status
		$appointment = $this->appointment_service->get_appointment( $appointment_id );
		
		if ( ! $appointment ) {
			return new WP_Error(
				'not_found',
				__( 'Appointment not found.', 'nobat' ),
				array( 'status' => 404 )
			);
		}
		
		// Route to appropriate service method based on target status and current status
		switch ( $new_status ) {
			case 'confirmed':
				// If restoring from cancelled/completed, use restore method
				if ( in_array( $appointment['status'], array( 'cancelled', 'completed' ), true ) ) {
					$result = $this->appointment_service->restore_appointment( $appointment_id, $admin_id );
					$message = __( 'Appointment restored successfully.', 'nobat' );
				} else {
					// Normal confirm from pending
					$result = $this->appointment_service->confirm_appointment( $appointment_id, $admin_id );
					$message = __( 'Appointment confirmed successfully.', 'nobat' );
				}
				break;
			
			case 'completed':
				$result = $this->appointment_service->complete_appointment( $appointment_id, $admin_id );
				$message = __( 'Appointment marked as completed.', 'nobat' );
				break;
			
		case 'cancelled':
			$result = $this->appointment_service->cancel_appointment( $appointment_id, $admin_id );
			$message = __( 'Appointment cancelled successfully.', 'nobat' );
			break;
			
			default:
				return new WP_Error(
					'invalid_status',
					__( 'Invalid status provided.', 'nobat' ),
					array( 'status' => 400 )
				);
		}
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => $message
			),
			200
		);
	}
	
	/**
	 * Cancel appointment (admin action)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function cancel( $request ) {
		$appointment_id = $request->get_param( 'id' );
		$reason = $request->get_param( 'reason' );
		$admin_id = $this->auth_service->get_current_user_id();
		
		$result = $this->appointment_service->cancel_appointment( $appointment_id, $admin_id, $reason );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Appointment cancelled successfully.', 'nobat' )
			),
			200
		);
	}
	
	/**
	 * Update appointment report
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_report( $request ) {
		$appointment_id = $request->get_param( 'id' );
		$report = $request->get_param( 'report' );
		
		// Verify appointment exists
		$appointment = $this->appointment_service->get_appointment( $appointment_id );
		
		if ( ! $appointment ) {
			return new WP_Error(
				'not_found',
				__( 'Appointment not found.', 'nobat' ),
				array( 'status' => 404 )
			);
		}
		
		// Update the report
		$result = $this->appointment_service->update_appointment_report( $appointment_id, $report );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Report updated successfully.', 'nobat' ),
				'report' => $report
			),
			200
		);
	}
	
	/**
	 * Get cancellation requests (admin only)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_cancellation_requests( $request ) {
		$requests = $this->appointment_service->get_cancellation_requests();
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'requests' => $requests,
				'count' => count( $requests )
			),
			200
		);
	}
	
	/**
	 * Get appointment history (admin only)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_history( $request ) {
		$appointment_id = $request->get_param( 'id' );
		
		$history = $this->appointment_service->get_appointment_history( $appointment_id );
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'history' => $history
			),
			200
		);
	}
}

