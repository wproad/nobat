<?php
/**
 * User Repository
 * 
 * Wrapper for WordPress user functions
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Repositories;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * User Repository class
 */
class UserRepository {
	
	/**
	 * Find user by ID
	 * 
	 * @param int $user_id
	 * @return WP_User|null
	 */
	public function find( $user_id ) {
		$user = get_user_by( 'ID', $user_id );
		return $user ? $user : null;
	}
	
	/**
	 * Find user by email
	 * 
	 * @param string $email
	 * @return WP_User|null
	 */
	public function find_by_email( $email ) {
		$user = get_user_by( 'email', $email );
		return $user ? $user : null;
	}
	
	/**
	 * Check if user exists
	 * 
	 * @param int $user_id
	 * @return bool
	 */
	public function exists( $user_id ) {
		return $this->find( $user_id ) !== null;
	}
	
	/**
	 * Check if user is admin
	 * 
	 * @param int $user_id
	 * @return bool
	 */
	public function is_admin( $user_id ) {
		$user = $this->find( $user_id );
		return $user && in_array( 'administrator', $user->roles, true );
	}
	
	/**
	 * Get current user ID
	 * 
	 * @return int
	 */
	public function get_current_user_id() {
		return get_current_user_id();
	}
	
	/**
	 * Get current user
	 * 
	 * @return WP_User|null
	 */
	public function get_current_user() {
		$user_id = $this->get_current_user_id();
		return $user_id ? $this->find( $user_id ) : null;
	}
	
	/**
	 * Check if user is logged in
	 * 
	 * @return bool
	 */
	public function is_user_logged_in() {
		return is_user_logged_in();
	}
	
	/**
	 * Check if current user can manage options
	 * 
	 * @return bool
	 */
	public function current_user_can_manage() {
		return current_user_can( 'manage_options' );
	}
	
	/**
	 * Get user display name
	 * 
	 * @param int $user_id
	 * @return string
	 */
	public function get_display_name( $user_id ) {
		$user = $this->find( $user_id );
		return $user ? $user->display_name : '';
	}
	
	/**
	 * Get user email
	 * 
	 * @param int $user_id
	 * @return string
	 */
	public function get_email( $user_id ) {
		$user = $this->find( $user_id );
		return $user ? $user->user_email : '';
	}
	
	/**
	 * Get all admins
	 * 
	 * @return array Array of WP_User objects
	 */
	public function get_all_admins() {
		return get_users( array( 'role' => 'administrator' ) );
	}
	
	/**
	 * Get user meta
	 * 
	 * @param int $user_id
	 * @param string $key
	 * @param bool $single
	 * @return mixed
	 */
	public function get_meta( $user_id, $key, $single = true ) {
		return get_user_meta( $user_id, $key, $single );
	}
	
	/**
	 * Update user meta
	 * 
	 * @param int $user_id
	 * @param string $key
	 * @param mixed $value
	 * @return bool
	 */
	public function update_meta( $user_id, $key, $value ) {
		return update_user_meta( $user_id, $key, $value );
	}
}

