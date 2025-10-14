<?php

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
/**
 * Update a single schedule slot status (available/unavailable)
 * Expects JSON: { schedule_id, date (Y-m-d), time_slot ("HH:MM-HH:MM"), status }
 */
function appointment_booking_update_schedule_slot( $request ) {
    global $wpdb;
    $schedules_table = $wpdb->prefix . 'schedules';

    $data = $request->get_json_params();
    $schedule_id = isset( $data['schedule_id'] ) ? intval( $data['schedule_id'] ) : 0;
    $date        = isset( $data['date'] ) ? sanitize_text_field( $data['date'] ) : '';
    $time_slot   = isset( $data['time_slot'] ) ? sanitize_text_field( $data['time_slot'] ) : '';
    $status      = isset( $data['status'] ) ? sanitize_text_field( $data['status'] ) : '';

    if ( ! $schedule_id || empty( $date ) || empty( $time_slot ) || empty( $status ) ) {
        return new WP_Error( 'invalid_params', __( 'Missing required parameters', 'appointment-booking' ), [ 'status' => 400 ] );
    }

    if ( ! in_array( $status, [ 'available', 'unavailable' ], true ) ) {
        return new WP_Error( 'invalid_status', __( 'Invalid status value', 'appointment-booking' ), [ 'status' => 400 ] );
    }

    $schedule = $wpdb->get_row( $wpdb->prepare(
        "SELECT * FROM $schedules_table WHERE id = %d",
        $schedule_id
    ), ARRAY_A );

    if ( ! $schedule ) {
        return new WP_Error( 'schedule_not_found', __( 'Schedule not found', 'appointment-booking' ), [ 'status' => 404 ] );
    }

    $timeslots = json_decode( $schedule['timeslots'], true );
    if ( ! is_array( $timeslots ) ) {
        return new WP_Error( 'invalid_schedule', __( 'Schedule timeslots are invalid', 'appointment-booking' ), [ 'status' => 500 ] );
    }

    $start_end = explode( '-', $time_slot );
    $slot_start = trim( $start_end[0] ?? '' );
    $slot_end   = trim( $start_end[1] ?? '' );
    if ( empty( $slot_start ) || empty( $slot_end ) ) {
        return new WP_Error( 'invalid_time_slot', __( 'Invalid time slot format', 'appointment-booking' ), [ 'status' => 400 ] );
    }

    $found = false;
    foreach ( $timeslots as &$day ) {
        if ( isset( $day['date'] ) && $day['date'] === $date ) {
            if ( ! isset( $day['slots'] ) || ! is_array( $day['slots'] ) ) {
                $day['slots'] = [];
            }
            // Try to find existing slot
            foreach ( $day['slots'] as &$slot ) {
                if ( isset( $slot['start'], $slot['end'] ) && $slot['start'] === $slot_start && $slot['end'] === $slot_end ) {
                    // Do not allow changing a reserved slot here
                    if ( isset( $slot['status'] ) && $slot['status'] === 'reserved' ) {
                        return new WP_Error( 'slot_reserved', __( 'Cannot change a reserved slot via this endpoint', 'appointment-booking' ), [ 'status' => 400 ] );
                    }
                    $slot['status'] = $status;
                    $found = true;
                    break;
                }
            }
            // If not found, create the slot entry (covers UI 'unavailable' rows not persisted yet)
            if ( ! $found ) {
                $day['slots'][] = [
                    'start'  => $slot_start,
                    'end'    => $slot_end,
                    'status' => $status,
                ];
                // Keep slots ordered by time for consistency
                usort( $day['slots'], function( $a, $b ) {
                    return strcmp( $a['start'] ?? '', $b['start'] ?? '' );
                } );
                $found = true;
            }
            // We handled the correct day; break outer loop
            break;
        }
    }

    if ( ! $found ) {
        return new WP_Error( 'slot_not_found', __( 'Slot not found in schedule', 'appointment-booking' ), [ 'status' => 404 ] );
    }

    $updated_timeslots = wp_json_encode( $timeslots );
    $updated = $wpdb->update(
        $schedules_table,
        [ 'timeslots' => $updated_timeslots ],
        [ 'id' => $schedule_id ],
        [ '%s' ],
        [ '%d' ]
    );

    if ( false === $updated ) {
        return new WP_Error( 'db_error', __( 'Failed to update schedule timeslots', 'appointment-booking' ), [ 'status' => 500 ] );
    }

    return rest_ensure_response( [ 'success' => true ] );
}


/**
 * Get all schedules
 */
function appointment_booking_get_all_schedules( $request ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'schedules';

    $schedules = $wpdb->get_results( "SELECT * FROM $table_name ORDER BY id DESC", ARRAY_A );

    if ( ! $schedules ) {
        return rest_ensure_response( [] );
    }

    // Decode JSON fields for each schedule
    foreach ( $schedules as &$schedule ) {
        $schedule['weekly_hours'] = json_decode( $schedule['weekly_hours'], true );
        
        if ( isset( $schedule['timeslots'] ) && ! empty( $schedule['timeslots'] ) ) {
            $schedule['timeslots'] = json_decode( $schedule['timeslots'], true );
        }
    }

    return rest_ensure_response( $schedules );
}


/**
 * Get single schedule by ID
 */
function appointment_booking_get_schedule_by_id( $request ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'schedules';
    $schedule_id = intval( $request->get_param( 'id' ) );

    $schedule = $wpdb->get_row( $wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $schedule_id
    ), ARRAY_A );

    if ( ! $schedule ) {
        return new WP_Error( 'schedule_not_found', __( 'Schedule not found', 'appointment-booking' ), [ 'status' => 404 ] );
    }

    // Decode JSON fields
    $schedule['weekly_hours'] = json_decode( $schedule['weekly_hours'], true );
    
    if ( isset( $schedule['timeslots'] ) && ! empty( $schedule['timeslots'] ) ) {
        $schedule['timeslots'] = json_decode( $schedule['timeslots'], true );
    }

    return rest_ensure_response( $schedule );
}


/**
 * Update schedule
 */
function appointment_booking_update_schedule( $request ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'schedules';
    $schedule_id = intval( $request->get_param( 'id' ) );

    // Check if schedule exists
    $existing = $wpdb->get_row( $wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $schedule_id
    ), ARRAY_A );

    if ( ! $existing ) {
        return new WP_Error( 'schedule_not_found', __( 'Schedule not found', 'appointment-booking' ), [ 'status' => 404 ] );
    }

    // Get and sanitize data from request
    $data = $request->get_json_params();
    
    error_log('Schedule update request data: ' . print_r($data, true));

    $name             = sanitize_text_field( $data['name'] );
    $is_active        = ! empty( $data['isActive'] ) ? 1 : 0;
    $start_day        = sanitize_text_field( $data['startDay'] );
    $end_day          = sanitize_text_field( $data['endDay'] );
    $meeting_duration = intval( $data['meetingDuration'] );
    $buffer           = intval( $data['buffer'] );
    $admin_id         = intval( $data['selectedAdmin'] );
    $weekly_hours_raw = isset( $data['weeklyHours'] ) ? $data['weeklyHours'] : [];

    // Validate required fields
    if ( empty( $name ) || empty( $start_day ) || empty( $end_day ) || empty( $weekly_hours_raw ) ) {
        return new WP_Error(
            'invalid_data',
            __( 'Missing required schedule data (name, start day, end day, or weekly hours)', 'appointment-booking' ),
            [ 'status' => 400 ]
        );
    }

    // Generate weekly slots (same logic as create)
    $weekly_slots = [];

    foreach ( $weekly_hours_raw as $day => $periods ) {
        if ( ! is_array( $periods ) || empty( $periods ) ) {
            continue;
        }

        $day_slots = [];

        foreach ( $periods as $period ) {
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

    $weekly_hours = wp_json_encode( $weekly_slots );

    // Generate timeslots for all days in the schedule period
    $timeslots = [];
    $current_date = new DateTime($start_day);
    $end_date_obj = new DateTime($end_day);
    
    while ($current_date <= $end_date_obj) {
        $day_of_week = strtolower($current_date->format('D'));
        $formatted_date = $current_date->format('l, F j');
        
        $day_entry = [
            'date' => $current_date->format('Y-m-d'),
            'formatted_date' => $formatted_date,
            'slots' => []
        ];
        
        if (isset($weekly_slots[$day_of_week]) && is_array($weekly_slots[$day_of_week])) {
            $day_entry['slots'] = $weekly_slots[$day_of_week];
        }
        
        $timeslots[] = $day_entry;
        $current_date->modify('+1 day');
    }
    
    $timeslots_json = wp_json_encode($timeslots);

    // Update schedule in database
    $updated = $wpdb->update(
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
        [ 'id' => $schedule_id ],
        [ '%s', '%d', '%d', '%s', '%s', '%d', '%d', '%s', '%s' ],
        [ '%d' ]
    );

    if ( false === $updated ) {
        error_log('Database update failed: ' . $wpdb->last_error);
        return new WP_Error(
            'db_error',
            __( 'Failed to update schedule: ' . $wpdb->last_error, 'appointment-booking' ),
            [ 'status' => 500 ]
        );
    }

    return rest_ensure_response(
        [
            'success' => true,
            'message' => __( 'Schedule updated successfully', 'appointment-booking' ),
        ]
    );
}


/**
 * Delete schedule
 */
function appointment_booking_delete_schedule( $request ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'schedules';
    $schedule_id = intval( $request->get_param( 'id' ) );

    // Check if schedule exists
    $schedule = $wpdb->get_row( $wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $schedule_id
    ), ARRAY_A );

    if ( ! $schedule ) {
        return new WP_Error( 'schedule_not_found', __( 'Schedule not found', 'appointment-booking' ), [ 'status' => 404 ] );
    }

    // Optional: Check if schedule has related appointments
    $appointments_table = $wpdb->prefix . 'appointments';
    $has_appointments = $wpdb->get_var( $wpdb->prepare(
        "SELECT COUNT(*) FROM $appointments_table WHERE schedule_id = %d",
        $schedule_id
    ) );

    if ( $has_appointments > 0 ) {
        return new WP_Error(
            'schedule_has_appointments',
            __( 'Cannot delete schedule with existing appointments. Delete appointments first.', 'appointment-booking' ),
            [ 'status' => 400 ]
        );
    }

    // Delete the schedule
    $result = $wpdb->delete(
        $table_name,
        [ 'id' => $schedule_id ],
        [ '%d' ]
    );

    if ( false === $result ) {
        return new WP_Error(
            'db_error',
            __( 'Failed to delete schedule', 'appointment-booking' ),
            [ 'status' => 500 ]
        );
    }

    return rest_ensure_response(
        [
            'success' => true,
            'message' => __( 'Schedule deleted successfully', 'appointment-booking' ),
        ]
    );
}
