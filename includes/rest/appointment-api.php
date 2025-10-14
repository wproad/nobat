<?php

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
	
	$appointments_table = $wpdb->prefix . 'appointments';
	$schedules_table = $wpdb->prefix . 'schedules';
	
	$client_name = sanitize_text_field( $request->get_param( 'client_name' ) );
	$client_phone = sanitize_text_field( $request->get_param( 'client_phone' ) );
	$appointment_date = sanitize_text_field( $request->get_param( 'appointment_date' ) );
	$time_slot = sanitize_text_field( $request->get_param( 'time_slot' ) );
	
	// Validate required fields
	if ( empty( $client_name ) || empty( $client_phone ) || empty( $appointment_date ) || empty( $time_slot ) ) {
		return new WP_Error( 'missing_fields', 'All fields are required', array( 'status' => 400 ) );
	}
	
	// Get the active schedule
	$schedule = $wpdb->get_row( "SELECT * FROM $schedules_table WHERE is_active = 1 ORDER BY id DESC LIMIT 1", ARRAY_A );
	
	if ( ! $schedule ) {
		return new WP_Error( 'schedule_not_found', 'No active schedule found', array( 'status' => 404 ) );
	}
	
	$schedule_id = $schedule['id'];
	
	// Check if slot is already taken
	$existing = $wpdb->get_var( $wpdb->prepare(
		"SELECT id FROM $appointments_table WHERE appointment_date = %s AND time_slot = %s AND schedule_id = %d",
		$appointment_date,
		$time_slot,
		$schedule_id
	) );
	
	if ( $existing ) {
		return new WP_Error( 'slot_taken', 'This time slot is already booked', array( 'status' => 400 ) );
	}
	
	// Decode the schedule's timeslots
	$timeslots = json_decode( $schedule['timeslots'], true );
	
	if ( ! is_array( $timeslots ) ) {
		return new WP_Error( 'invalid_schedule', 'Schedule timeslots are invalid', array( 'status' => 500 ) );
	}
	
	// Find the specific date and time slot to update
	$slot_found = false;
	foreach ( $timeslots as &$day ) {
		if ( $day['date'] === $appointment_date ) {
			// Found the date, now find the time slot
			if ( isset( $day['slots'] ) && is_array( $day['slots'] ) ) {
				foreach ( $day['slots'] as &$slot ) {
					// Match the time slot (e.g., "09:00-09:30")
					$slot_range = $slot['start'] . '-' . $slot['end'];
					if ( $slot_range === $time_slot ) {
						// Update the slot status from available to reserved
						if ( $slot['status'] !== 'available' ) {
							return new WP_Error( 'slot_not_available', 'This time slot is not available', array( 'status' => 400 ) );
						}
						$slot['status'] = 'reserved';
						$slot_found = true;
						break 2; // Break both loops
					}
				}
			}
		}
	}
	
	if ( ! $slot_found ) {
		return new WP_Error( 'slot_not_found', 'Time slot not found in schedule', array( 'status' => 404 ) );
	}
	
	// Update the schedule with the modified timeslots
	$updated_timeslots = wp_json_encode( $timeslots );
	$schedule_update = $wpdb->update(
		$schedules_table,
		array( 'timeslots' => $updated_timeslots ),
		array( 'id' => $schedule_id ),
		array( '%s' ),
		array( '%d' )
	);
	
	if ( $schedule_update === false ) {
		return new WP_Error( 'schedule_update_failed', 'Failed to update schedule timeslots', array( 'status' => 500 ) );
	}
	
	// Insert the appointment
	$result = $wpdb->insert(
		$appointments_table,
		array(
			'client_name' => $client_name,
			'client_phone' => $client_phone,
			'appointment_date' => $appointment_date,
			'time_slot' => $time_slot,
			'status' => 'pending',
			'schedule_id' => $schedule_id,
		),
		array( '%s', '%s', '%s', '%s', '%s', '%d' )
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
	
	$appointments_table = $wpdb->prefix . 'appointments';
	$schedules_table = $wpdb->prefix . 'schedules';
	$appointment_id = $request->get_param( 'id' );
	
	// Get the appointment details before deleting
	$appointment = $wpdb->get_row( $wpdb->prepare(
		"SELECT * FROM $appointments_table WHERE id = %d",
		$appointment_id
	), ARRAY_A );
	
	if ( ! $appointment ) {
		return new WP_Error( 'appointment_not_found', 'Appointment not found', array( 'status' => 404 ) );
	}
	
	// Get the related schedule
	$schedule = $wpdb->get_row( $wpdb->prepare(
		"SELECT * FROM $schedules_table WHERE id = %d",
		$appointment['schedule_id']
	), ARRAY_A );
	
	if ( $schedule ) {
		// Decode the schedule's timeslots
		$timeslots = json_decode( $schedule['timeslots'], true );
		
		if ( is_array( $timeslots ) ) {
			// Find the specific date and time slot to update back to available
			foreach ( $timeslots as &$day ) {
				if ( $day['date'] === $appointment['appointment_date'] ) {
					if ( isset( $day['slots'] ) && is_array( $day['slots'] ) ) {
						foreach ( $day['slots'] as &$slot ) {
							$slot_range = $slot['start'] . '-' . $slot['end'];
							if ( $slot_range === $appointment['time_slot'] ) {
								// Change status back to available
								$slot['status'] = 'available';
								break 2;
							}
						}
					}
				}
			}
			
			// Update the schedule with the modified timeslots
			$updated_timeslots = wp_json_encode( $timeslots );
			$wpdb->update(
				$schedules_table,
				array( 'timeslots' => $updated_timeslots ),
				array( 'id' => $schedule['id'] ),
				array( '%s' ),
				array( '%d' )
			);
		}
	}
	
	// Delete the appointment
	$result = $wpdb->delete(
		$appointments_table,
		array( 'id' => $appointment_id ),
		array( '%d' )
	);
	
	if ( $result === false ) {
		return new WP_Error( 'database_error', 'Failed to delete appointment', array( 'status' => 500 ) );
	}
	
	return new WP_REST_Response( array( 'message' => 'Appointment deleted successfully' ), 200 );
}