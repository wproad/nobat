<?php
/**
 * Authentication Service
 * 
 * Handles user authentication and authorization
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Services;

use Nobat\Repositories\UserRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Auth Service class
 */
class AuthService {
	
	/**
	 * User repository
	 * 
	 * @var UserRepository
	 */
	private $user_repository;
	
	/**
	 * Constructor
	 * 
	 * @param UserRepository|null $user_repository
	 */
	public function __construct( $user_repository = null ) {
		$this->user_repository = $user_repository ?: new UserRepository();
	}
	
	/**
	 * Check if user is logged in
	 * 
	 * @return bool
	 */
	public function is_logged_in() {
		return $this->user_repository->is_user_logged_in();
	}
	
	/**
	 * Get current user ID
	 * 
	 * @return int
	 */
	public function get_current_user_id() {
		return $this->user_repository->get_current_user_id();
	}
	
	/**
	 * Get current user
	 * 
	 * @return WP_User|null
	 */
	public function get_current_user() {
		return $this->user_repository->get_current_user();
	}
	
	/**
	 * Check if current user is admin
	 * 
	 * @return bool
	 */
	public function is_admin() {
		if ( ! $this->is_logged_in() ) {
			return false;
		}
		
		return $this->user_repository->current_user_can_manage();
	}
	
	/**
	 * Check if user can book appointments
	 * 
	 * @return bool
	 */
	public function can_book_appointments() {
		return $this->is_logged_in();
	}
	
	/**
	 * Check if user can manage appointments
	 * 
	 * @param int|null $user_id User ID to check (null for current user)
	 * @return bool
	 */
	public function can_manage_appointments( $user_id = null ) {
		if ( ! $this->is_logged_in() ) {
			return false;
		}
		
		// Admins can manage all appointments
		if ( $this->is_admin() ) {
			return true;
		}
		
		// Users can only manage their own appointments
		if ( $user_id ) {
			return $this->get_current_user_id() === (int) $user_id;
		}
		
		return true;
	}
	
	/**
	 * Check if user can cancel appointment
	 * 
	 * @param int $appointment_user_id The user who owns the appointment
	 * @return bool
	 */
	public function can_cancel_appointment( $appointment_user_id ) {
		if ( ! $this->is_logged_in() ) {
			return false;
		}
		
		// Admins can cancel any appointment
		if ( $this->is_admin() ) {
			return true;
		}
		
		// Users can only request cancellation of their own appointments
		return $this->get_current_user_id() === (int) $appointment_user_id;
	}
	
	/**
	 * Require user to be logged in
	 * 
	 * @throws Exception If user is not logged in
	 */
	public function require_logged_in() {
		if ( ! $this->is_logged_in() ) {
			throw new \Exception( __( 'You must be logged in to perform this action.', 'nobat' ) );
		}
	}
	
	/**
	 * Require user to be admin
	 * 
	 * @throws Exception If user is not admin
	 */
	public function require_admin() {
		$this->require_logged_in();
		
		if ( ! $this->is_admin() ) {
			throw new \Exception( __( 'You do not have permission to perform this action.', 'nobat' ) );
		}
	}
	
	/**
	 * Get authentication error for REST API
	 * 
	 * @return WP_Error
	 */
	public function get_auth_error() {
		return new WP_Error(
			'not_logged_in',
			__( 'You must be logged in to book appointments. Please log in and try again.', 'nobat' ),
			array( 'status' => 401 )
		);
	}
	
	/**
	 * Get permission error for REST API
	 * 
	 * @return WP_Error
	 */
	public function get_permission_error() {
		return new WP_Error(
			'no_permission',
			__( 'You do not have permission to perform this action.', 'nobat' ),
			array( 'status' => 403 )
		);
	}
	
	/**
	 * Validate user can access resource
	 * 
	 * @param int $resource_user_id Owner of the resource
	 * @return bool|WP_Error True if authorized, WP_Error otherwise
	 */
	public function validate_access( $resource_user_id ) {
		if ( ! $this->is_logged_in() ) {
			return $this->get_auth_error();
		}
		
		// Admins have full access
		if ( $this->is_admin() ) {
			return true;
		}
		
		// Users can only access their own resources
		if ( $this->get_current_user_id() !== (int) $resource_user_id ) {
			return $this->get_permission_error();
		}
		
		return true;
	}
}

