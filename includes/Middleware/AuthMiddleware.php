<?php
/**
 * Authentication Middleware
 * 
 * Handles authentication checks for REST API endpoints
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Middleware;

use WP_REST_Request;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Auth Middleware class
 */
class AuthMiddleware {
	
	/**
	 * Check if user is logged in (for REST API)
	 * 
	 * @param WP_REST_Request $request
	 * @return bool|WP_Error
	 */
	public static function require_login( $request ) {
		if ( ! is_user_logged_in() ) {
			return new WP_Error(
				'not_logged_in',
				__( 'You must be logged in to book appointments. Please log in and try again.', 'nobat' ),
				array( 'status' => 401 )
			);
		}
		
		return true;
	}
	
	/**
	 * Check if user is admin (for REST API)
	 * 
	 * @param WP_REST_Request $request
	 * @return bool|WP_Error
	 */
	public static function require_admin( $request ) {
		if ( ! is_user_logged_in() ) {
			return new WP_Error(
				'not_logged_in',
				__( 'You must be logged in to perform this action.', 'nobat' ),
				array( 'status' => 401 )
			);
		}
		
		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'no_permission',
				__( 'You do not have permission to perform this action.', 'nobat' ),
				array( 'status' => 403 )
			);
		}
		
		return true;
	}
	
	/**
	 * Check if user can access specific appointment
	 * 
	 * @param WP_REST_Request $request
	 * @return bool|WP_Error
	 */
	public static function can_access_appointment( $request ) {
		if ( ! is_user_logged_in() ) {
			return new WP_Error(
				'not_logged_in',
				__( 'You must be logged in to access appointments.', 'nobat' ),
				array( 'status' => 401 )
			);
		}
		
		// Admins can access all appointments
		if ( current_user_can( 'manage_options' ) ) {
			return true;
		}
		
		// Get appointment ID from request
		$appointment_id = $request->get_param( 'id' );
		
		if ( ! $appointment_id ) {
			return true; // Let controller handle validation
		}
		
		// Load appointment repository to check ownership
		require_once plugin_dir_path( dirname( dirname( __FILE__ ) ) ) . 'repositories/AppointmentRepository.php';
		$repo = new Appointment_Booking_Appointment_Repository();
		$appointment = $repo->find( $appointment_id );
		
		if ( ! $appointment ) {
			return new WP_Error(
				'not_found',
				__( 'Appointment not found.', 'nobat' ),
				array( 'status' => 404 )
			);
		}
		
		// Check if user owns the appointment
		if ( (int) $appointment['user_id'] !== get_current_user_id() ) {
			return new WP_Error(
				'no_permission',
				__( 'You do not have permission to access this appointment.', 'nobat' ),
				array( 'status' => 403 )
			);
		}
		
		return true;
	}
	
	/**
	 * Public endpoint - always allow
	 * 
	 * @param WP_REST_Request $request
	 * @return bool
	 */
	public static function allow_public( $request ) {
		return true;
	}
}

