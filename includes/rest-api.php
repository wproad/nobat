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

}
add_action( 'rest_api_init', 'appointment_booking_register_rest_routes' );

/**
 * Get all appointments (admin)
 */
function appointment_booking_get_appointments( $request ) {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'appointments';
	$appointments = $wpdb->get_results( "SELECT * FROM $table_name ORDER BY appointment_date DESC, time_slot ASC" );
	
	return new WP_REST_Response( $appointments, 200 );
}

/**
 * Create new appointment
 */
function appointment_booking_create_appointment( $request ) {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'appointments';
	
	$client_name = sanitize_text_field( $request->get_param( 'client_name' ) );
	$client_phone = sanitize_text_field( $request->get_param( 'client_phone' ) );
	$appointment_date = sanitize_text_field( $request->get_param( 'appointment_date' ) );
	$time_slot = sanitize_text_field( $request->get_param( 'time_slot' ) );
	
	// Validate required fields
	if ( empty( $client_name ) || empty( $client_phone ) || empty( $appointment_date ) || empty( $time_slot ) ) {
		return new WP_Error( 'missing_fields', 'All fields are required', array( 'status' => 400 ) );
	}
	
	// Check if slot is already taken
	$existing = $wpdb->get_var( $wpdb->prepare(
		"SELECT id FROM $table_name WHERE appointment_date = %s AND time_slot = %s",
		$appointment_date,
		$time_slot
	) );
	
	if ( $existing ) {
		return new WP_Error( 'slot_taken', 'This time slot is already booked', array( 'status' => 400 ) );
	}
	
	$result = $wpdb->insert(
		$table_name,
		array(
			'client_name' => $client_name,
			'client_phone' => $client_phone,
			'appointment_date' => $appointment_date,
			'time_slot' => $time_slot,
			'status' => 'pending',
		),
		array( '%s', '%s', '%s', '%s', '%s' )
	);
	
	if ( $result === false ) {
		return new WP_Error( 'database_error', 'Failed to create appointment', array( 'status' => 500 ) );
	}
	
	$appointment_id = $wpdb->insert_id;
	
	return new WP_REST_Response( array(
		'id' => $appointment_id,
		'message' => 'Appointment booked successfully!'
	), 201 );
}

/**
 * Update appointment status
 */
function appointment_booking_update_appointment( $request ) {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'appointments';
	$appointment_id = $request->get_param( 'id' );
	$status = sanitize_text_field( $request->get_param( 'status' ) );
	
	$result = $wpdb->update(
		$table_name,
		array( 'status' => $status ),
		array( 'id' => $appointment_id ),
		array( '%s' ),
		array( '%d' )
	);
	
	if ( $result === false ) {
		return new WP_Error( 'database_error', 'Failed to update appointment', array( 'status' => 500 ) );
	}
	
	return new WP_REST_Response( array( 'message' => 'Appointment updated successfully' ), 200 );
}

/**
 * Delete appointment
 */
function appointment_booking_delete_appointment( $request ) {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'appointments';
	$appointment_id = $request->get_param( 'id' );
	
	$result = $wpdb->delete(
		$table_name,
		array( 'id' => $appointment_id ),
		array( '%d' )
	);
	
	if ( $result === false ) {
		return new WP_Error( 'database_error', 'Failed to delete appointment', array( 'status' => 500 ) );
	}
	
	return new WP_REST_Response( array( 'message' => 'Appointment deleted successfully' ), 200 );
}

/**
 * Get available time slots for a date
 */
function appointment_booking_get_available_slots( $request ) {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'appointments';
	$date = $request->get_param( 'date' );

	$all_slots = appointment_booking_generate_slots_from_settings( false ); // exclude breaks from availability
	
	if ( $date ) {
		// Get booked slots for the date
		$booked_slots = $wpdb->get_col( $wpdb->prepare(
			"SELECT time_slot FROM $table_name WHERE appointment_date = %s",
			$date
		) );
		
		// Return available slots
		$available_slots = array_diff( $all_slots, $booked_slots );
	} else {
		$available_slots = $all_slots;
	}
	
	return new WP_REST_Response( array_values( $available_slots ), 200 );
}


function appointment_booking_create_schedule( $request ) {
    global $wpdb;

    // 1️⃣ Get and sanitize data from REST request
    $data = $request->get_json_params();
    
    // Debug logging
    error_log('Schedule creation request data: ' . print_r($data, true));

    $name             = sanitize_text_field( $data['name'] );
    $is_active        = ! empty( $data['isActive'] ) ? 1 : 0; // Use 1 or 0 for database consistency
    $start_day        = sanitize_text_field( $data['startDay'] );
    $end_day          = sanitize_text_field( $data['endDay'] );
    $meeting_duration = intval( $data['meetingDuration'] );
    $buffer           = intval( $data['buffer'] );
    $admin_id         = intval( $data['selectedAdmin'] );

    // Expected: array like:
    // {
    //   "monday": [{ "start": "09:00", "end": "17:00" }],
    //   "tuesday": [{ "start": "10:00", "end": "15:00" }]
    // }
    $weekly_hours_raw = isset( $data['weeklyHours'] ) ? $data['weeklyHours'] : [];

    $table_name = $wpdb->prefix . 'schedules';

    // 2️⃣ Validate required fields
    if ( empty( $name ) || empty( $start_day ) || empty( $end_day ) || empty( $weekly_hours_raw ) ) {
        return new WP_Error(
            'invalid_data',
            __( 'Missing required schedule data (name, start day, end day, or weekly hours)', 'appointment-booking' ),
            [ 'status' => 400 ]
        );
    }

    // 3️⃣ Generate all time slots for each weekday based on weeklyHours, duration, and buffer
// 3️⃣ Generate all time slots for each weekday based on weeklyHours, duration, and buffer
$weekly_slots = [];

foreach ( $weekly_hours_raw as $day => $periods ) {
    if ( ! is_array( $periods ) || empty( $periods ) ) {
        continue;
    }

    $day_slots = [];

    foreach ( $periods as $period ) {
        // Support both "09:00-17:00" string or {start,end} array
        if ( is_string( $period ) ) {
            $parts = explode( '-', $period );
            $period = [
                'start' => trim( $parts[0] ?? '' ),
                'end'   => trim( $parts[1] ?? '' ),
            ];
        }

        if ( empty( $period['start'] ) || empty( $period['end'] ) ) {
            continue;
        }

        $start_time = strtotime( $period['start'] );
        $end_time   = strtotime( $period['end'] );

        // Generate slots
        while ( $start_time + ( $meeting_duration * 60 ) <= $end_time ) {
            $slot_end = $start_time + ( $meeting_duration * 60 );

            $day_slots[] = [
                'start'  => date( 'H:i', $start_time ),
                'end'    => date( 'H:i', $slot_end ),
                'status' => 'available',
            ];

            $start_time = $slot_end + ( $buffer * 60 );
        }
    }

    $weekly_slots[ $day ] = $day_slots;
}




    // 4️⃣ Convert computed slots to JSON for database storage
    $weekly_hours = wp_json_encode( $weekly_slots );

	error_log( $weekly_hours );

    // 4.5️⃣ Generate timeslots for all days in the schedule period
    $timeslots = [];
    $current_date = new DateTime($start_day);
    $end_date_obj = new DateTime($end_day);
    
    while ($current_date <= $end_date_obj) {
        // Get 3-letter day abbreviation (lowercase) to match weekly_slots keys
        $day_of_week = strtolower($current_date->format('D')); // mon, tue, wed, etc.
        $formatted_date = $current_date->format('l, F j'); // e.g., "Monday, October 13"
        
        $day_entry = [
            'date' => $current_date->format('Y-m-d'),
            'formatted_date' => $formatted_date,
            'slots' => []
        ];
        
        // If this day has slots in weekly_slots, add them
        if (isset($weekly_slots[$day_of_week]) && is_array($weekly_slots[$day_of_week])) {
            $day_entry['slots'] = $weekly_slots[$day_of_week];
        }
        
        $timeslots[] = $day_entry;
        $current_date->modify('+1 day');
    }
    
    $timeslots_json = wp_json_encode($timeslots);
    error_log('Generated timeslots: ' . $timeslots_json);

    // 5️⃣ Insert schedule into database (no update logic)
    // Each new schedule is a separate entry
    $inserted = $wpdb->insert(
        $table_name,
        [
            'name'             => $name,
            'admin_id'         => $admin_id,
            'is_active'        => $is_active,
            'start_day'        => $start_day,
            'end_day'          => $end_day,
            'meeting_duration' => $meeting_duration,
            'buffer'           => $buffer,
            'weekly_hours'     => $weekly_hours,
            'timeslots'        => $timeslots_json,
        ],
        [ '%s', '%d', '%d', '%s', '%s', '%d', '%d', '%s', '%s' ]
    );

    // 6️⃣ Handle potential DB errors
    if ( false === $inserted ) {
        error_log('Database insert failed: ' . $wpdb->last_error);
        return new WP_Error(
            'db_error',
            __( 'Failed to insert schedule: ' . $wpdb->last_error, 'appointment-booking' ),
            [ 'status' => 500, 'error' => $wpdb->last_error ]
        );
    }

    // 7️⃣ Return REST response
    return rest_ensure_response(
        [
            'success' => true,
            'message' => __( 'Schedule created successfully', 'appointment-booking' ),
        ]
    );
}


function appointment_booking_get_active_schedule( $request ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'schedules';

    $schedule = $wpdb->get_row( "SELECT * FROM $table_name WHERE is_active = 1 ORDER BY id DESC LIMIT 1", ARRAY_A );

    if ( ! $schedule ) {
        return new WP_Error( 'no_schedule', __( 'No active schedule found', 'appointment-booking' ), [ 'status' => 404 ] );
    }

    $schedule['weekly_hours'] = json_decode( $schedule['weekly_hours'], true );
    
    // Decode timeslots if it exists
    if ( isset( $schedule['timeslots'] ) && ! empty( $schedule['timeslots'] ) ) {
        $schedule['timeslots'] = json_decode( $schedule['timeslots'], true );
    }

    return rest_ensure_response( $schedule );
}
