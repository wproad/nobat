<?php
/**
 * REST API Router
 *
 * Registers all v2 REST API routes.
 *
 * @package Nobat
 * @subpackage Core
 * @since 2.0.0
 */

namespace Nobat\Core;

use Nobat\Middleware\AuthMiddleware;
use Nobat\Controllers\AppointmentController;
use Nobat\Controllers\ScheduleController;
use Nobat\Controllers\SlotController;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Router class
 */
class Router {

	/**
	 * API namespace
	 *
	 * @var string
	 */
	private $namespace = 'nobat/v2';

	/**
	 * Appointment controller
	 *
	 * @var AppointmentController
	 */
	private $appointment_controller;

	/**
	 * Schedule controller
	 *
	 * @var ScheduleController
	 */
	private $schedule_controller;

	/**
	 * Slot controller
	 *
	 * @var SlotController
	 */
	private $slot_controller;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->appointment_controller = new AppointmentController();
		$this->schedule_controller = new ScheduleController();
		$this->slot_controller = new SlotController();
	}

	/**
	 * Register all REST API routes
	 */
	public function register_routes() {
		$this->register_appointment_routes();
		$this->register_schedule_routes();
		$this->register_slot_routes();
	}

	/**
	 * Register appointment routes
	 */
	private function register_appointment_routes() {
		// Create appointment (user, requires login)
		register_rest_route( $this->namespace, '/appointments', array(
			'methods' => 'POST',
			'callback' => array( $this->appointment_controller, 'create' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_login' ),
			'args' => array(
				'slot_id' => array(
					'required' => true,
					'type' => 'integer'
				),
				'schedule_id' => array(
					'required' => true,
					'type' => 'integer'
				),
				'note' => array(
					'required' => false,
					'type' => 'string'
				),
			),
		) );

		// Get user's appointments
		register_rest_route( $this->namespace, '/appointments', array(
			'methods' => 'GET',
			'callback' => array( $this->appointment_controller, 'get_my_appointments' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_login' ),
		) );

		// Get single appointment
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)', array(
			'methods' => 'GET',
			'callback' => array( $this->appointment_controller, 'get_one' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_login' ),
		) );

		// Update appointment status (admin only)
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)', array(
			'methods' => 'PUT',
			'callback' => array( $this->appointment_controller, 'update_status' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
			'args' => array(
				'status' => array(
					'required' => true,
					'type' => 'string',
					'enum' => array( 'pending', 'confirmed', 'completed', 'cancelled', 'cancel_requested' )
				),
			),
		) );

		// Update appointment report (admin only)
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)/report', array(
			'methods' => 'PUT',
			'callback' => array( $this->appointment_controller, 'update_report' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
			'args' => array(
				'report' => array(
					'required' => true,
					'type' => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
			),
		) );

		// Delete appointment (admin only) - Use cancel instead
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)', array(
			'methods' => 'DELETE',
			'callback' => array( $this->appointment_controller, 'cancel' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Request cancellation (user)
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)/cancel', array(
			'methods' => 'POST',
			'callback' => array( $this->appointment_controller, 'request_cancel' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_login' ),
			'args' => array(
				'reason' => array(
					'required' => false,
					'type' => 'string'
				),
			),
		) );

		// Approve cancellation (admin) - actually cancels the appointment
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)/approve-cancellation', array(
			'methods' => 'POST',
			'callback' => array( $this->appointment_controller, 'cancel' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Deny cancellation (admin) - NOT IMPLEMENTED YET
		// When denied, the appointment stays active and cancellation_requested_at is cleared
		// register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)/deny-cancellation', array(
		// 	'methods' => 'POST',
		// 	'callback' => array( $this->appointment_controller, 'deny_cancellation' ),
		// 	'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		// ) );

		// Confirm appointment (admin)
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)/confirm', array(
			'methods' => 'POST',
			'callback' => array( $this->appointment_controller, 'confirm' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Complete appointment (admin)
		register_rest_route( $this->namespace, '/appointments/(?P<id>\d+)/complete', array(
			'methods' => 'POST',
			'callback' => array( $this->appointment_controller, 'complete' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Get all appointments (admin)
		register_rest_route( $this->namespace, '/appointments/all', array(
			'methods' => 'GET',
			'callback' => array( $this->appointment_controller, 'get_all' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Get pending cancellation requests (admin)
		register_rest_route( $this->namespace, '/appointments/cancellation-requests', array(
			'methods' => 'GET',
			'callback' => array( $this->appointment_controller, 'get_cancellation_requests' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );
	}

	/**
	 * Register schedule routes
	 */
	private function register_schedule_routes() {
		// Create schedule (admin)
		register_rest_route( $this->namespace, '/schedules', array(
			'methods' => 'POST',
			'callback' => array( $this->schedule_controller, 'create' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Get all schedules (admin)
		register_rest_route( $this->namespace, '/schedules', array(
			'methods' => 'GET',
			'callback' => array( $this->schedule_controller, 'get_all' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Get active schedule (public/admin)
		register_rest_route( $this->namespace, '/schedules/active', array(
			'methods' => 'GET',
			'callback' => array( $this->schedule_controller, 'get_active' ),
			'permission_callback' => '__return_true',
		) );

		// Get single schedule (admin)
		register_rest_route( $this->namespace, '/schedules/(?P<id>\d+)', array(
			'methods' => 'GET',
			'callback' => array( $this->schedule_controller, 'get_one' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Update schedule (admin)
		register_rest_route( $this->namespace, '/schedules/(?P<id>\d+)', array(
			'methods' => 'PUT',
			'callback' => array( $this->schedule_controller, 'update' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Delete schedule (admin)
		register_rest_route( $this->namespace, '/schedules/(?P<id>\d+)', array(
			'methods' => 'DELETE',
			'callback' => array( $this->schedule_controller, 'delete' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Activate schedule (admin)
		register_rest_route( $this->namespace, '/schedules/(?P<id>\d+)/activate', array(
			'methods' => 'POST',
			'callback' => array( $this->schedule_controller, 'activate' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Deactivate schedule (admin)
		register_rest_route( $this->namespace, '/schedules/(?P<id>\d+)/deactivate', array(
			'methods' => 'POST',
			'callback' => array( $this->schedule_controller, 'deactivate' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
		) );

		// Update schedule slot by schedule+date+time (admin) - Legacy endpoint
		register_rest_route( $this->namespace, '/schedules/slot', array(
			'methods' => 'PUT',
			'callback' => array( $this->slot_controller, 'update_by_schedule_and_time' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
			'args' => array(
				'schedule_id' => array(
					'required' => true,
					'type' => 'integer'
				),
				'date' => array(
					'required' => true,
					'type' => 'string'
				),
				'time_slot' => array(
					'required' => true,
					'type' => 'string'
				),
				'status' => array(
					'required' => true,
					'type' => 'string',
					'enum' => array( 'available', 'unavailable', 'booked', 'blocked' )
				),
			),
		) );
	}

	/**
	 * Register slot routes
	 */
	private function register_slot_routes() {
		// Get available slots for a schedule (public)
		register_rest_route( $this->namespace, '/slots', array(
			'methods' => 'GET',
			'callback' => array( $this->slot_controller, 'get_available' ),
			'permission_callback' => '__return_true',
			'args' => array(
				'schedule_id' => array(
					'required' => true,
					'type' => 'integer'
				),
				'date_from' => array(
					'required' => false,
					'type' => 'string'
				),
				'date_to' => array(
					'required' => false,
					'type' => 'string'
				),
			),
		) );

		// Update slot status (admin)
		register_rest_route( $this->namespace, '/slots/(?P<id>\d+)', array(
			'methods' => 'PUT',
			'callback' => array( $this->slot_controller, 'update_status' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
			'args' => array(
				'status' => array(
					'required' => true,
					'type' => 'string',
					'enum' => array( 'available', 'unavailable', 'booked', 'blocked' )
				),
			),
		) );

		// Block multiple slots (admin)
		register_rest_route( $this->namespace, '/slots/block', array(
			'methods' => 'POST',
			'callback' => array( $this->slot_controller, 'block_slots' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
			'args' => array(
				'slot_ids' => array(
					'required' => true,
					'type' => 'array'
				),
			),
		) );

		// Unblock multiple slots (admin)
		register_rest_route( $this->namespace, '/slots/unblock', array(
			'methods' => 'POST',
			'callback' => array( $this->slot_controller, 'unblock_slots' ),
			'permission_callback' => array( 'Nobat\Middleware\AuthMiddleware', 'require_admin' ),
			'args' => array(
				'slot_ids' => array(
					'required' => true,
					'type' => 'array'
				),
			),
		) );
	}
}

