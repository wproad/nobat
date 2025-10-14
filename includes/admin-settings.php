<?php

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Settings: register options and fields
 */
function appointment_booking_register_settings() {
	
	add_settings_section(
		'appointment_booking_notifications_section',
		__( 'SMS Notifications', 'appointment-booking' ),
		'__return_false',
		'appointment_booking_settings'
	);

    register_setting( 'appointment_booking_settings', 'appointment_booking_notify_admin', array(
		'type' => 'integer',
		'default' => 0,
		'sanitize_callback' => function( $value ) {
			return absint( $value );
		},
	) );

	register_setting( 'appointment_booking_settings', 'appointment_booking_notify_client', array(
		'type' => 'boolean',
		'default' => false,
		'sanitize_callback' => function( $value ) {
			return (bool) $value;
		},
	) );

	register_setting( 'appointment_booking_settings', 'appointment_booking_reminder_minutes', array(
		'type' => 'integer',
		'default' => 15,
		'sanitize_callback' => function( $value ) {
			$value = absint( $value );
			return $value > 0 ? $value : 15;
		},
	) );

	// Time slots section
	// add_settings_section(
	// 	'appointment_booking_timeslots_section',
	// 	__( 'Time Slots', 'appointment-booking' ),
	// 	'__return_false',
	// 	'appointment_booking_settings'
	// );

	// // Slot interval (minutes)
	// register_setting( 'appointment_booking_settings', 'appointment_booking_slot_interval', array(
	// 	'type' => 'integer',
	// 	'default' => 60,
	// 	'sanitize_callback' => function( $value ) {
	// 		$value = absint( $value );
	// 		$allowed = array( 10, 15, 20, 30, 45, 60, 90, 120 );
	// 		return in_array( $value, $allowed, true ) ? $value : 60;
	// 	},
	// ) );

	// // Day start and end (HH:MM)
	// register_setting( 'appointment_booking_settings', 'appointment_booking_day_start', array(
	// 	'type' => 'string',
	// 	'default' => '09:00',
	// 	'sanitize_callback' => 'appointment_booking_sanitize_time_hhmm',
	// ) );
	// register_setting( 'appointment_booking_settings', 'appointment_booking_day_end', array(
	// 	'type' => 'string',
	// 	'default' => '17:00',
	// 	'sanitize_callback' => 'appointment_booking_sanitize_time_hhmm',
	// ) );

	// // Break ranges (one per line, HH:MM-HH:MM)
	// register_setting( 'appointment_booking_settings', 'appointment_booking_breaks', array(
	// 	'type' => 'string',
	// 	'default' => "12:00-14:00",
	// 	'sanitize_callback' => function( $value ) {
	// 		$lines = preg_split( '/\r\n|\r|\n/', (string) $value );
	// 		$clean = array();
	// 		foreach ( $lines as $line ) {
	// 			$line = trim( $line );
	// 			if ( $line === '' ) { continue; }
	// 			if ( preg_match( '/^([01]?\d|2[0-3]):[0-5]\d-([01]?\d|2[0-3]):[0-5]\d$/', $line ) ) {
	// 				$clean[] = $line;
	// 			}
	// 		}
	// 		return implode( "\n", $clean );
	// 	},
	// ) );

    add_settings_field(
        'appointment_booking_notify_admin',
        __( 'Notify Admin', 'appointment-booking' ),
        'appointment_booking_field_notify_admin',
        'appointment_booking_settings',
        'appointment_booking_notifications_section'
    );

	add_settings_field(
		'appointment_booking_notify_client',
		__( 'Notify Client', 'appointment-booking' ),
		'appointment_booking_field_notify_client',
		'appointment_booking_settings',
		'appointment_booking_notifications_section'
	);

	add_settings_field(
		'appointment_booking_reminder_minutes',
		__( 'Reminder (minutes before)', 'appointment-booking' ),
		'appointment_booking_field_reminder_minutes',
		'appointment_booking_settings',
		'appointment_booking_notifications_section'
	);

	// // Time slots fields
	// add_settings_field(
	// 	'appointment_booking_slot_interval',
	// 	__( 'Slot interval (minutes)', 'appointment-booking' ),
	// 	'appointment_booking_field_slot_interval',
	// 	'appointment_booking_settings',
	// 	'appointment_booking_timeslots_section'
	// );
	// add_settings_field(
	// 	'appointment_booking_day_start',
	// 	__( 'Day start (HH:MM)', 'appointment-booking' ),
	// 	'appointment_booking_field_day_start',
	// 	'appointment_booking_settings',
	// 	'appointment_booking_timeslots_section'
	// );
	// add_settings_field(
	// 	'appointment_booking_day_end',
	// 	__( 'Day end (HH:MM)', 'appointment-booking' ),
	// 	'appointment_booking_field_day_end',
	// 	'appointment_booking_settings',
	// 	'appointment_booking_timeslots_section'
	// );
	// add_settings_field(
	// 	'appointment_booking_breaks',
	// 	__( 'Breaks (one per line, HH:MM-HH:MM)', 'appointment-booking' ),
	// 	'appointment_booking_field_breaks',
	// 	'appointment_booking_settings',
	// 	'appointment_booking_timeslots_section'
	// );
}
add_action( 'admin_init', 'appointment_booking_register_settings' );

function appointment_booking_field_notify_admin() {
    $selected = (int) get_option( 'appointment_booking_notify_admin', 0 );
    $admins = get_users( array( 'role__in' => array( 'administrator' ) ) );
    echo '<select name="appointment_booking_notify_admin" style="min-width:260px;">';
    echo '<option value="0">' . esc_html__( 'None', 'appointment-booking' ) . '</option>';
    foreach ( $admins as $admin ) {
        printf(
            '<option value="%d" %s>%s</option>',
            $admin->ID,
            selected( $selected === (int) $admin->ID, true, false ),
            esc_html( $admin->display_name )
        );
    }
    echo '</select>';
}

function appointment_booking_field_notify_client() {
	$val = (bool) get_option( 'appointment_booking_notify_client', false );
	printf(
		'<label><input type="checkbox" name="appointment_booking_notify_client" value="1" %s /> %s</label>',
		checked( $val, true, false ),
		esc_html__( 'Send notifications to client', 'appointment-booking' )
	);
}

function appointment_booking_field_reminder_minutes() {
	$val = (int) get_option( 'appointment_booking_reminder_minutes', 15 );
	printf(
		'<input type="number" name="appointment_booking_reminder_minutes" value="%d" min="1" step="1" style="width:100px;" />',
		$val
	);
}

function appointment_booking_field_slot_interval() {
	$val = (int) get_option( 'appointment_booking_slot_interval', 60 );
	$options = array( 10, 15, 20, 30, 45, 60, 90, 120 );
	echo '<select name="appointment_booking_slot_interval" style="min-width:160px">';
	foreach ( $options as $opt ) {
		printf( '<option value="%d" %s>%d</option>', $opt, selected( $val === (int) $opt, true, false ), $opt );
	}
	echo '</select>';
}

function appointment_booking_field_day_start() {
	$val = esc_attr( (string) get_option( 'appointment_booking_day_start', '09:00' ) );
	printf( '<input type="time" name="appointment_booking_day_start" value="%s" />', $val );
}

function appointment_booking_field_day_end() {
	$val = esc_attr( (string) get_option( 'appointment_booking_day_end', '17:00' ) );
	printf( '<input type="time" name="appointment_booking_day_end" value="%s" />', $val );
}

function appointment_booking_field_breaks() {
	$val = (string) get_option( 'appointment_booking_breaks', "12:00-14:00" );
	printf( '<textarea name="appointment_booking_breaks" rows="4" cols="40" placeholder="12:00-13:00\n15:30-16:00">%s</textarea>', esc_textarea( $val ) );
}


function appointment_booking_settings_page_html() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Appointment Booking Settings', 'appointment-booking' ); ?></h1>
        <form method="post" action="options.php">
            <?php
            // Default Settings API rendering: multiple sections appear stacked on a single page.
            settings_fields( 'appointment_booking_settings' );
            do_settings_sections( 'appointment_booking_settings' );
            submit_button();
            ?>
        </form>
    </div>
	<?php
}