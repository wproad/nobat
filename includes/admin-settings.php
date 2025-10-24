<?php

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Settings: register options and fields
 */
function nobat_register_settings() {
	
	add_settings_section(
		'nobat_messages_section',
		__( 'Messages', 'nobat' ),
		'__return_false',
		'nobat_settings'
	);

	add_settings_section(
		'nobat_notifications_section',
		__( 'SMS Notifications', 'nobat' ),
		'__return_false',
		'nobat_settings'
	);

	register_setting( 'nobat_settings', 'nobat_success_message', array(
		'type' => 'string',
		'default' => '',
		'sanitize_callback' => 'wp_kses_post',
	) );

    register_setting( 'nobat_settings', 'nobat_notify_admin', array(
		'type' => 'integer',
		'default' => 0,
		'sanitize_callback' => function( $value ) {
			return absint( $value );
		},
	) );

	register_setting( 'nobat_settings', 'nobat_notify_client', array(
		'type' => 'boolean',
		'default' => false,
		'sanitize_callback' => function( $value ) {
			return (bool) $value;
		},
	) );

	register_setting( 'nobat_settings', 'nobat_reminder_minutes', array(
		'type' => 'integer',
		'default' => 15,
		'sanitize_callback' => function( $value ) {
			$value = absint( $value );
			return $value > 0 ? $value : 15;
		},
	) );

	// Time slots section
	// add_settings_section(
	// 	'nobat_timeslots_section',
	// 	__( 'Time Slots', 'nobat' ),
	// 	'__return_false',
	// 	'nobat_settings'
	// );

	// // Slot interval (minutes)
	// register_setting( 'nobat_settings', 'nobat_slot_interval', array(
	// 	'type' => 'integer',
	// 	'default' => 60,
	// 	'sanitize_callback' => function( $value ) {
	// 		$value = absint( $value );
	// 		$allowed = array( 10, 15, 20, 30, 45, 60, 90, 120 );
	// 		return in_array( $value, $allowed, true ) ? $value : 60;
	// 	},
	// ) );

	// // Day start and end (HH:MM)
	// register_setting( 'nobat_settings', 'nobat_day_start', array(
	// 	'type' => 'string',
	// 	'default' => '09:00',
	// 	'sanitize_callback' => 'nobat_sanitize_time_hhmm',
	// ) );
	// register_setting( 'nobat_settings', 'nobat_day_end', array(
	// 	'type' => 'string',
	// 	'default' => '17:00',
	// 	'sanitize_callback' => 'nobat_sanitize_time_hhmm',
	// ) );

	// // Break ranges (one per line, HH:MM-HH:MM)
	// register_setting( 'nobat_settings', 'nobat_breaks', array(
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
		'nobat_success_message',
		__( 'Success Message After Booking', 'nobat' ),
		'nobat_field_success_message',
		'nobat_settings',
		'nobat_messages_section'
	);

    add_settings_field(
        'nobat_notify_admin',
        __( 'Notify Admin', 'nobat' ),
        'nobat_field_notify_admin',
        'nobat_settings',
        'nobat_notifications_section'
    );

	add_settings_field(
		'nobat_notify_client',
		__( 'Notify Client', 'nobat' ),
		'nobat_field_notify_client',
		'nobat_settings',
		'nobat_notifications_section'
	);

	add_settings_field(
		'nobat_reminder_minutes',
		__( 'Reminder (minutes before)', 'nobat' ),
		'nobat_field_reminder_minutes',
		'nobat_settings',
		'nobat_notifications_section'
	);

	// // Time slots fields
	// add_settings_field(
	// 	'nobat_slot_interval',
	// 	__( 'Slot interval (minutes)', 'nobat' ),
	// 	'nobat_field_slot_interval',
	// 	'nobat_settings',
	// 	'nobat_timeslots_section'
	// );
	// add_settings_field(
	// 	'nobat_day_start',
	// 	__( 'Day start (HH:MM)', 'nobat' ),
	// 	'nobat_field_day_start',
	// 	'nobat_settings',
	// 	'nobat_timeslots_section'
	// );
	// add_settings_field(
	// 	'nobat_day_end',
	// 	__( 'Day end (HH:MM)', 'nobat' ),
	// 	'nobat_field_day_end',
	// 	'nobat_settings',
	// 	'nobat_timeslots_section'
	// );
	// add_settings_field(
	// 	'nobat_breaks',
	// 	__( 'Breaks (one per line, HH:MM-HH:MM)', 'nobat' ),
	// 	'nobat_field_breaks',
	// 	'nobat_settings',
	// 	'nobat_timeslots_section'
	// );
}
add_action( 'admin_init', 'nobat_register_settings' );

function nobat_field_success_message() {
	$content = get_option( 'nobat_success_message', '' );
	
	echo '<p class="description">' . esc_html__( 'This message will be displayed to users after successfully booking an appointment. If empty, users will be redirected to their appointments list.', 'nobat' ) . '</p>';
	
	wp_editor( 
		$content, 
		'nobat_success_message',
		array(
			'textarea_name' => 'nobat_success_message',
			'media_buttons' => false,
			'textarea_rows' => 10,
			'teeny' => false,
			'tinymce' => array(
				'toolbar1' => 'formatselect,bold,italic,underline,bullist,numlist,link,unlink,undo,redo',
				'toolbar2' => '',
			),
		)
	);
}

function nobat_field_notify_admin() {
    $selected = (int) get_option( 'nobat_notify_admin', 0 );
    $admins = get_users( array( 'role__in' => array( 'administrator' ) ) );
    echo '<select name="nobat_notify_admin" style="min-width:260px;">';
    echo '<option value="0">' . esc_html__( 'None', 'nobat' ) . '</option>';
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

function nobat_field_notify_client() {
	$val = (bool) get_option( 'nobat_notify_client', false );
	printf(
		'<label><input type="checkbox" name="nobat_notify_client" value="1" %s /> %s</label>',
		checked( $val, true, false ),
		esc_html__( 'Send notifications to client', 'nobat' )
	);
}

function nobat_field_reminder_minutes() {
	$val = (int) get_option( 'nobat_reminder_minutes', 15 );
	printf(
		'<input type="number" name="nobat_reminder_minutes" value="%d" min="1" step="1" style="width:100px;" />',
		$val
	);
}

function nobat_field_slot_interval() {
	$val = (int) get_option( 'nobat_slot_interval', 60 );
	$options = array( 10, 15, 20, 30, 45, 60, 90, 120 );
	echo '<select name="nobat_slot_interval" style="min-width:160px">';
	foreach ( $options as $opt ) {
		printf( '<option value="%d" %s>%d</option>', $opt, selected( $val === (int) $opt, true, false ), $opt );
	}
	echo '</select>';
}

function nobat_field_day_start() {
	$val = esc_attr( (string) get_option( 'nobat_day_start', '09:00' ) );
	printf( '<input type="time" name="nobat_day_start" value="%s" />', $val );
}

function nobat_field_day_end() {
	$val = esc_attr( (string) get_option( 'nobat_day_end', '17:00' ) );
	printf( '<input type="time" name="nobat_day_end" value="%s" />', $val );
}

function nobat_field_breaks() {
	$val = (string) get_option( 'nobat_breaks', "12:00-14:00" );
	printf( '<textarea name="nobat_breaks" rows="4" cols="40" placeholder="12:00-13:00\n15:30-16:00">%s</textarea>', esc_textarea( $val ) );
}


function nobat_settings_page_html() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Appointment Booking Settings', 'nobat' ); ?></h1>
        <form method="post" action="options.php">
            <?php
            // Default Settings API rendering: multiple sections appear stacked on a single page.
            settings_fields( 'nobat_settings' );
            do_settings_sections( 'nobat_settings' );
            submit_button();
            ?>
        </form>
    </div>
	<?php
}