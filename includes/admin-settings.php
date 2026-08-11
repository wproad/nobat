<?php

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Settings: register options and fields
 */
function nobat_register_settings() {
	
	add_settings_section(
		'nobat_booking_section',
		__( 'Booking Settings', 'nobat' ),
		'__return_false',
		'nobat_settings'
	);

	add_settings_section(
		'nobat_messages_section',
		__( 'Messages', 'nobat' ),
		'__return_false',
		'nobat_settings'
	);

	add_settings_section(
		'nobat_appearance_section',
		__( 'Appearance', 'nobat' ),
		'__return_false',
		'nobat_settings'
	);

	// add_settings_section(
	// 	'nobat_notifications_section',
	// 	__( 'SMS Notifications', 'nobat' ),
	// 	'__return_false',
	// 	'nobat_settings'
	// );

	register_setting( 'nobat_settings', 'nobat_max_appointments', array(
		'type' => 'integer',
		'default' => 3,
		'sanitize_callback' => function( $value ) {
			$value = absint( $value );
			return $value > 0 ? $value : 3;
		},
	) );

	register_setting( 'nobat_settings', 'nobat_success_message', array(
		'type' => 'string',
		'default' => '',
		'sanitize_callback' => 'wp_kses_post',
	) );

	register_setting( 'nobat_settings', 'nobat_brand_color', array(
		'type' => 'string',
		'default' => '#2A9B9B',
		'sanitize_callback' => function( $value ) {
			return nobat_sanitize_brand_color( $value, '#2A9B9B' );
		},
	) );

	register_setting( 'nobat_settings', 'nobat_brand_color_on', array(
		'type' => 'string',
		'default' => '#FCFCFC',
		'sanitize_callback' => function( $value ) {
			return nobat_sanitize_brand_color( $value, '#FCFCFC' );
		},
	) );

	register_setting( 'nobat_settings', 'nobat_brand_color_soft', array(
		'type' => 'string',
		'default' => '#E6F3F3',
		'sanitize_callback' => function( $value ) {
			return nobat_sanitize_brand_color( $value, '#E6F3F3' );
		},
	) );

	register_setting( 'nobat_settings', 'nobat_brand_color_hover', array(
		'type' => 'string',
		'default' => '#217A7A',
		'sanitize_callback' => function( $value ) {
			return nobat_sanitize_brand_color( $value, '#217A7A' );
		},
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
		'nobat_max_appointments',
		__( 'Max Active Appointments per User', 'nobat' ),
		'nobat_field_max_appointments',
		'nobat_settings',
		'nobat_booking_section'
	);

	add_settings_field(
		'nobat_success_message',
		__( 'Success Message After Booking', 'nobat' ),
		'nobat_field_success_message',
		'nobat_settings',
		'nobat_messages_section'
	);

	add_settings_field(
		'nobat_brand_color',
		__( 'Brand Colors', 'nobat' ),
		'nobat_field_brand_color',
		'nobat_settings',
		'nobat_appearance_section'
	);

    // add_settings_field(
    //     'nobat_notify_admin',
    //     __( 'Notify Admin', 'nobat' ),
    //     'nobat_field_notify_admin',
    //     'nobat_settings',
    //     'nobat_notifications_section'
    // );

	// add_settings_field(
	// 	'nobat_notify_client',
	// 	__( 'Notify Client', 'nobat' ),
	// 	'nobat_field_notify_client',
	// 	'nobat_settings',
	// 	'nobat_notifications_section'
	// );

	// add_settings_field(
	// 	'nobat_reminder_minutes',
	// 	__( 'Reminder (minutes before)', 'nobat' ),
	// 	'nobat_field_reminder_minutes',
	// 	'nobat_settings',
	// 	'nobat_notifications_section'
	// );

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

function nobat_field_max_appointments() {
	$val = (int) get_option( 'nobat_max_appointments', 3 );
	printf(
		'<input type="number" name="nobat_max_appointments" value="%d" min="1" max="20" step="1" style="width:100px;" />',
		$val
	);
	echo '<p class="description">' . esc_html__( 'Maximum number of active (pending/confirmed) appointments a user can have at the same time. Default: 3', 'nobat' ) . '</p>';
}

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

/**
 * Sanitize a brand color to #RRGGBB.
 *
 * @param string $value   Raw option value.
 * @param string $default Fallback hex when invalid.
 * @return string
 */
function nobat_sanitize_brand_color( $value, $default = '#2A9B9B' ) {
	$value = trim( (string) $value );
	if ( preg_match( '/^#([A-Fa-f0-9]{6})$/', $value ) ) {
		return strtoupper( $value );
	}
	if ( preg_match( '/^#([A-Fa-f0-9]{3})$/', $value ) ) {
		$r = $value[1];
		$g = $value[2];
		$b = $value[3];
		return strtoupper( "#{$r}{$r}{$g}{$g}{$b}{$b}" );
	}

	$default = trim( (string) $default );
	if ( preg_match( '/^#([A-Fa-f0-9]{6})$/', $default ) ) {
		return strtoupper( $default );
	}

	return '#2A9B9B';
}

/**
 * Soft Slot accent token defaults (hex equivalents of tokens.css placeholders).
 *
 * @return array{accent:string,on:string,soft:string,hover:string}
 */
function nobat_get_brand_color_defaults() {
	return array(
		'accent' => '#2A9B9B',
		'on'     => '#FCFCFC',
		'soft'   => '#E6F3F3',
		'hover'  => '#217A7A',
	);
}

/**
 * Resolved Soft Slot --accent* brand colors from options.
 *
 * @return array{accent:string,on:string,soft:string,hover:string}
 */
function nobat_get_brand_colors() {
	$defaults = nobat_get_brand_color_defaults();

	return array(
		'accent' => nobat_sanitize_brand_color( (string) get_option( 'nobat_brand_color', $defaults['accent'] ), $defaults['accent'] ),
		'on'     => nobat_sanitize_brand_color( (string) get_option( 'nobat_brand_color_on', $defaults['on'] ), $defaults['on'] ),
		'soft'   => nobat_sanitize_brand_color( (string) get_option( 'nobat_brand_color_soft', $defaults['soft'] ), $defaults['soft'] ),
		'hover'  => nobat_sanitize_brand_color( (string) get_option( 'nobat_brand_color_hover', $defaults['hover'] ), $defaults['hover'] ),
	);
}

/**
 * Brand color fields (WP color pickers for Soft Slot --accent* knobs).
 */
function nobat_field_brand_color() {
	$defaults = nobat_get_brand_color_defaults();
	$colors   = nobat_get_brand_colors();

	$fields = array(
		array(
			'name'        => 'nobat_brand_color',
			'label'       => __( 'Accent', 'nobat' ),
			'value'       => $colors['accent'],
			'default'     => $defaults['accent'],
			'description' => __( 'Primary buttons and selected dates/slots (--accent).', 'nobat' ),
		),
		array(
			'name'        => 'nobat_brand_color_on',
			'label'       => __( 'Accent on', 'nobat' ),
			'value'       => $colors['on'],
			'default'     => $defaults['on'],
			'description' => __( 'Text/icon color on accent fills (--accent-on).', 'nobat' ),
		),
		array(
			'name'        => 'nobat_brand_color_soft',
			'label'       => __( 'Accent soft', 'nobat' ),
			'value'       => $colors['soft'],
			'default'     => $defaults['soft'],
			'description' => __( 'Soft accent surfaces such as active tabs (--accent-soft).', 'nobat' ),
		),
		array(
			'name'        => 'nobat_brand_color_hover',
			'label'       => __( 'Accent hover', 'nobat' ),
			'value'       => $colors['hover'],
			'default'     => $defaults['hover'],
			'description' => __( 'Hover state for primary accent controls (--accent-hover).', 'nobat' ),
		),
	);

	echo '<div class="nobat-brand-colors" style="display:flex;flex-direction:column;gap:16px;max-width:420px;">';
	foreach ( $fields as $field ) {
		echo '<div class="nobat-brand-color-row">';
		printf(
			'<label for="%1$s" style="display:block;font-weight:600;margin-bottom:4px;">%2$s</label>',
			esc_attr( $field['name'] ),
			esc_html( $field['label'] )
		);
		printf(
			'<input type="text" id="%1$s" class="nobat-brand-color-field" name="%1$s" value="%2$s" data-default-color="%3$s" />',
			esc_attr( $field['name'] ),
			esc_attr( $field['value'] ),
			esc_attr( $field['default'] )
		);
		printf(
			'<p class="description" style="margin-top:4px;">%s</p>',
			esc_html( $field['description'] )
		);
		echo '</div>';
	}
	echo '</div>';
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