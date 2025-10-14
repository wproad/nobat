<?php


if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Register REST API routes
 */
function appointment_booking_register_rest_routes() {
	
	register_rest_route( 'appointment-booking/v1', '/appointments', array(
		'methods' => 'GET',
		'callback' => 'appointment_booking_get_appointments',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	) );

	register_rest_route( 'appointment-booking/v1', '/appointments', array(
		'methods' => 'POST',
		'callback' => 'appointment_booking_create_appointment',
		'permission_callback' => '__return_true', // Public endpoint for booking
	) );

	register_rest_route( 'appointment-booking/v1', '/appointments/(?P<id>\d+)', array(
		'methods' => 'PUT',
		'callback' => 'appointment_booking_update_appointment',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	) );

	register_rest_route( 'appointment-booking/v1', '/appointments/(?P<id>\d+)', array(
		'methods' => 'DELETE',
		'callback' => 'appointment_booking_delete_appointment',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	) );

	register_rest_route( 'appointment-booking/v1', '/available-slots', array(
		'methods' => 'GET',
		'callback' => 'appointment_booking_get_available_slots',
		'permission_callback' => '__return_true',
	) );

	// Returns the full-day slot template based on settings (includes breaks as empty rows)
	register_rest_route( 'appointment-booking/v1', '/time-slots-template', array(
		'methods' => 'GET',
		'callback' => 'appointment_booking_get_slot_template',
		'permission_callback' => function() { return current_user_can( 'manage_options' ); },
	) );

	register_rest_route('appointment-booking/v1', '/schedule', [
        'methods' => 'POST',
        'callback' => 'appointment_booking_create_schedule',
        'permission_callback' => function() {
            return current_user_can('manage_options'); // Only admins
        },
        'args' => [
            'name' => ['required' => true],
            'isActive' => ['required' => true],
            'startDay' => ['required' => true],
            'endDay' => ['required' => true],
            'meetingDuration' => ['required' => true],
            'buffer' => ['required' => true],
            'selectedAdmin' => ['required' => true],
            'weeklyHours' => ['required' => true],
        ]
    ]);

	register_rest_route( 'appointment-booking/v1', '/schedule/active', [
        'methods'  => 'GET',
        'callback' => 'appointment_booking_get_active_schedule',
        'permission_callback' => '__return_true',
    ] );

	// GET all schedules
	register_rest_route( 'appointment-booking/v1', '/schedules', [
		'methods'  => 'GET',
		'callback' => 'appointment_booking_get_all_schedules',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	] );

	// GET single schedule by ID
	register_rest_route( 'appointment-booking/v1', '/schedule/(?P<id>\d+)', [
		'methods'  => 'GET',
		'callback' => 'appointment_booking_get_schedule_by_id',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	] );

	// UPDATE schedule
	register_rest_route( 'appointment-booking/v1', '/schedule/(?P<id>\d+)', [
		'methods'  => 'PUT',
		'callback' => 'appointment_booking_update_schedule',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	] );

	// DELETE schedule
	register_rest_route( 'appointment-booking/v1', '/schedule/(?P<id>\d+)', [
		'methods'  => 'DELETE',
		'callback' => 'appointment_booking_delete_schedule',
		'permission_callback' => function() {
			return current_user_can( 'manage_options' );
		},
	] );

}
add_action( 'rest_api_init', 'appointment_booking_register_rest_routes' );


require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/rest/appointment-api.php';
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/rest/schedule-api.php';