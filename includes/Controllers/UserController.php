<?php
/**
 * User Controller
 *
 * Handles REST API requests for user search (admin)
 *
 * @package Nobat
 * @since 2.2.0
 */

namespace Nobat\Controllers;

use Nobat\Repositories\UserRepository;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * User Controller class
 */
class UserController {

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
		if ( $user_repository !== null ) {
			$this->user_repository = $user_repository;
		} else {
			$this->user_repository = nobat_service( 'user_repository' );
		}
	}

	/**
	 * Search users by name, email, or phone
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function search( $request ) {
		$query = $request->get_param( 'q' );

		if ( ! is_string( $query ) || strlen( trim( $query ) ) < 2 ) {
			return new WP_Error(
				'invalid_query',
				__( 'Search query must be at least 2 characters.', 'nobat' ),
				array( 'status' => 400 )
			);
		}

		$users = $this->user_repository->search( $query );

		return new WP_REST_Response(
			array(
				'success' => true,
				'users'   => $users,
			),
			200
		);
	}
}
