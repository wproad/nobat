<?php
/**
 * Plugin Name: Appointment Booking
 * Plugin URI: https://github.com/your-username/appointment-booking
 * Description: A simple appointment booking system for clients with admin management.
 * Version: 1.0.0
 * Requires at least: 6.1
 * Requires PHP: 7.4
 * Author: Your Name
 * Author URI: https://yourwebsite.com/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: appointment-booking
 *
 * @package appointment-booking
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


// Define plugin constants
define( 'APPOINTMENT_BOOKING_VERSION', '1.0.0' );
define( 'APPOINTMENT_BOOKING_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'APPOINTMENT_BOOKING_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Create appointments table on plugin activation
 */
function appointment_booking_activate() {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'appointments';
	
	$charset_collate = $wpdb->get_charset_collate();
	
	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		client_name varchar(100) NOT NULL,
		client_phone varchar(20) NOT NULL,
		appointment_date date NOT NULL,
		time_slot varchar(20) NOT NULL,
		status varchar(20) DEFAULT 'pending',
		created_at datetime DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (id)
	) $charset_collate;";
	
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
	
	// Add version option
	add_option( 'appointment_booking_version', '1.0.0' );
}
register_activation_hook( __FILE__, 'appointment_booking_activate' );

/**
 * Registers the admin page for viewing appointments
 */
function appointment_booking_admin_page() {
	add_menu_page(
		__( 'Appointments', 'appointment-booking' ),
		__( 'Appointments', 'appointment-booking' ),
		'manage_options',
		'appointment-booking',
		'appointment_booking_admin_page_html',
		'dashicons-calendar-alt',
		30
	);

	// Add calendar subpage
	add_submenu_page(
		'appointment-booking',
		__( 'Calendar View', 'appointment-booking' ),
		__( 'Calendar', 'appointment-booking' ),
		'manage_options',
		'appointment-booking-calendar',
		'appointment_booking_calendar_page_html'
	);

	// Add settings subpage
	add_submenu_page(
		'appointment-booking',
		__( 'Settings', 'appointment-booking' ),
		__( 'Settings', 'appointment-booking' ),
		'manage_options',
		'appointment-booking-settings',
		'appointment_booking_settings_page_html'
	);
}
add_action( 'admin_menu', 'appointment_booking_admin_page' );

/**
 * Outputs the root element for the admin React component
 */
function appointment_booking_admin_page_html() {
	printf(
		'<div class="wrap" id="appointment-booking-admin">%s</div>',
		esc_html__( 'Loading appointments...', 'appointment-booking' )
	);
}

/**
 * Outputs the root element for the calendar React component
 */
function appointment_booking_calendar_page_html() {
	printf(
		'<div class="wrap" id="appointment-booking-calendar">%s</div>',
		esc_html__( 'Loading calendar...', 'appointment-booking' )
	);
}

/**
 * Settings: register options and fields
 */
function appointment_booking_register_settings() {
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

	add_settings_section(
		'appointment_booking_notifications_section',
		__( 'SMS Notifications', 'appointment-booking' ),
		'__return_false',
		'appointment_booking_settings'
	);

	// Time slots section
	add_settings_section(
		'appointment_booking_timeslots_section',
		__( 'Time Slots', 'appointment-booking' ),
		'__return_false',
		'appointment_booking_settings'
	);

	// Slot interval (minutes)
	register_setting( 'appointment_booking_settings', 'appointment_booking_slot_interval', array(
		'type' => 'integer',
		'default' => 60,
		'sanitize_callback' => function( $value ) {
			$value = absint( $value );
			$allowed = array( 10, 15, 20, 30, 45, 60, 90, 120 );
			return in_array( $value, $allowed, true ) ? $value : 60;
		},
	) );

	// Day start and end (HH:MM)
	register_setting( 'appointment_booking_settings', 'appointment_booking_day_start', array(
		'type' => 'string',
		'default' => '09:00',
		'sanitize_callback' => 'appointment_booking_sanitize_time_hhmm',
	) );
	register_setting( 'appointment_booking_settings', 'appointment_booking_day_end', array(
		'type' => 'string',
		'default' => '17:00',
		'sanitize_callback' => 'appointment_booking_sanitize_time_hhmm',
	) );

	// Break ranges (one per line, HH:MM-HH:MM)
	register_setting( 'appointment_booking_settings', 'appointment_booking_breaks', array(
		'type' => 'string',
		'default' => "12:00-14:00",
		'sanitize_callback' => function( $value ) {
			$lines = preg_split( '/\r\n|\r|\n/', (string) $value );
			$clean = array();
			foreach ( $lines as $line ) {
				$line = trim( $line );
				if ( $line === '' ) { continue; }
				if ( preg_match( '/^([01]?\d|2[0-3]):[0-5]\d-([01]?\d|2[0-3]):[0-5]\d$/', $line ) ) {
					$clean[] = $line;
				}
			}
			return implode( "\n", $clean );
		},
	) );

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

	// Time slots fields
	add_settings_field(
		'appointment_booking_slot_interval',
		__( 'Slot interval (minutes)', 'appointment-booking' ),
		'appointment_booking_field_slot_interval',
		'appointment_booking_settings',
		'appointment_booking_timeslots_section'
	);
	add_settings_field(
		'appointment_booking_day_start',
		__( 'Day start (HH:MM)', 'appointment-booking' ),
		'appointment_booking_field_day_start',
		'appointment_booking_settings',
		'appointment_booking_timeslots_section'
	);
	add_settings_field(
		'appointment_booking_day_end',
		__( 'Day end (HH:MM)', 'appointment-booking' ),
		'appointment_booking_field_day_end',
		'appointment_booking_settings',
		'appointment_booking_timeslots_section'
	);
	add_settings_field(
		'appointment_booking_breaks',
		__( 'Breaks (one per line, HH:MM-HH:MM)', 'appointment-booking' ),
		'appointment_booking_field_breaks',
		'appointment_booking_settings',
		'appointment_booking_timeslots_section'
	);
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

/**
 * Settings field renderers for time slots
 */
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

/**
 * Sanitize time in HH:MM (24h)
 */
function appointment_booking_sanitize_time_hhmm( $time ) {
	$time = (string) $time;
	if ( preg_match( '/^([01]?\d|2[0-3]):[0-5]\d$/', $time ) ) {
		return $time;
	}
	return '09:00';
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

/**
 * Enqueues the necessary styles and script only on the admin page
 */
function appointment_booking_admin_enqueue_scripts( $admin_page ) {
    // Load assets only on our plugin pages; be flexible about the exact suffix
    if ( strpos( $admin_page, 'appointment-booking' ) === false ) {
        return;
    }

	// Determine which script to load
	$script_name = 'admin';
	$style_name = 'admin';
	
    if ( strpos( $admin_page, 'appointment-booking-calendar' ) !== false ) {
		$script_name = 'calendar';
		$style_name = 'calendar';
	}

	$asset_file = APPOINTMENT_BOOKING_PLUGIN_DIR . "build/{$script_name}.asset.php";

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		"appointment-booking-{$script_name}-script",
		APPOINTMENT_BOOKING_PLUGIN_URL . "build/{$script_name}.js",
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
		)
	);

	// Enqueue WordPress REST API script for nonce
	wp_enqueue_script( 'wp-api' );
	
	// Localize script with REST API nonce
	wp_localize_script( "appointment-booking-{$script_name}-script", 'wpApiSettings', array(
		'root' => esc_url_raw( rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
	) );

	wp_enqueue_style(
		"appointment-booking-{$style_name}-style",
		APPOINTMENT_BOOKING_PLUGIN_URL . "build/{$style_name}.css",
		array_filter(
			$asset['dependencies'],
			function ( $style ) {
				return wp_style_is( $style, 'registered' );
			}
		),
		$asset['version'],
	);
}
add_action( 'admin_enqueue_scripts', 'appointment_booking_admin_enqueue_scripts' );

/**
 * Enqueues frontend booking form scripts
 */
function appointment_booking_frontend_enqueue_scripts() {
	$asset_file = APPOINTMENT_BOOKING_PLUGIN_DIR . 'build/frontend.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'appointment-booking-frontend-script',
		APPOINTMENT_BOOKING_PLUGIN_URL . 'build/frontend.js',
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
		)
	);

	wp_enqueue_style(
		'appointment-booking-frontend-style',
		APPOINTMENT_BOOKING_PLUGIN_URL . 'build/frontend.css',
		array_filter(
			$asset['dependencies'],
			function ( $style ) {
				return wp_style_is( $style, 'registered' );
			}
		),
		$asset['version'],
	);
}
add_action( 'wp_enqueue_scripts', 'appointment_booking_frontend_enqueue_scripts' );

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

/**
 * Return the full-day slot template (includes breaks as rows)
 */
function appointment_booking_get_slot_template() {
	// Build template with excluded flags
	$interval = (int) get_option( 'appointment_booking_slot_interval', 60 );
	$start = (string) get_option( 'appointment_booking_day_start', '09:00' );
	$end = (string) get_option( 'appointment_booking_day_end', '17:00' );
	$breaks_raw = (string) get_option( 'appointment_booking_breaks', '12:00-14:00' );

	$break_ranges = array();
	foreach ( preg_split( '/\r\n|\r|\n/', $breaks_raw ) as $line ) {
		$line = trim( $line );
		if ( $line === '' ) { continue; }
		list( $bStart, $bEnd ) = array_map( 'trim', explode( '-', $line ) );
		$break_ranges[] = array( $bStart, $bEnd );
	}

	$template = array();
	$cursor = appointment_booking_time_to_minutes( $start );
	$end_minutes = appointment_booking_time_to_minutes( $end );
	while ( $cursor + $interval <= $end_minutes ) {
		$slot_start = $cursor;
		$slot_end = $cursor + $interval;
		$label = appointment_booking_minutes_to_time( $slot_start ) . '-' . appointment_booking_minutes_to_time( $slot_end );
		$in_break = false;
		foreach ( $break_ranges as $br ) {
			list( $bs, $be ) = $br;
			$bs_m = appointment_booking_time_to_minutes( $bs );
			$be_m = appointment_booking_time_to_minutes( $be );
			if ( $slot_start < $be_m && $slot_end > $bs_m ) {
				$in_break = true;
				break;
			}
		}
		$template[] = array(
			'label' => $label,
			'excluded' => $in_break,
		);
		$cursor += $interval;
	}

	return new WP_REST_Response( $template, 200 );
}

/**
 * Generate time slots from settings.
 *
 * @param bool $include_breaks If true, includes slots within breaks (for calendar layout). If false, excludes them (for availability).
 * @return array List of slot strings like "09:00-10:00".
 */
function appointment_booking_generate_slots_from_settings( $include_breaks = false ) {
	$interval = (int) get_option( 'appointment_booking_slot_interval', 60 );
	$start = (string) get_option( 'appointment_booking_day_start', '09:00' );
	$end = (string) get_option( 'appointment_booking_day_end', '17:00' );
	$breaks_raw = (string) get_option( 'appointment_booking_breaks', '12:00-14:00' );

	$break_ranges = array();
	foreach ( preg_split( '/\r\n|\r|\n/', $breaks_raw ) as $line ) {
		$line = trim( $line );
		if ( $line === '' ) { continue; }
		list( $bStart, $bEnd ) = array_map( 'trim', explode( '-', $line ) );
		$break_ranges[] = array( $bStart, $bEnd );
	}

	$slots = array();
	$cursor = appointment_booking_time_to_minutes( $start );
	$end_minutes = appointment_booking_time_to_minutes( $end );
	while ( $cursor + $interval <= $end_minutes ) {
		$slot_start = $cursor;
		$slot_end = $cursor + $interval;
		$label = appointment_booking_minutes_to_time( $slot_start ) . '-' . appointment_booking_minutes_to_time( $slot_end );
		
		$in_break = false;
		foreach ( $break_ranges as $br ) {
			list( $bs, $be ) = $br;
			$bs_m = appointment_booking_time_to_minutes( $bs );
			$be_m = appointment_booking_time_to_minutes( $be );
			if ( $slot_start < $be_m && $slot_end > $bs_m ) {
				$in_break = true;
				break;
			}
		}
		if ( $include_breaks || ! $in_break ) {
			$slots[] = $label;
		}
		$cursor += $interval;
	}
	return $slots;
}

function appointment_booking_time_to_minutes( $hhmm ) {
	list( $h, $m ) = array_map( 'intval', explode( ':', $hhmm ) );
	return $h * 60 + $m;
}

function appointment_booking_minutes_to_time( $minutes ) {
	$h = floor( $minutes / 60 );
	$m = $minutes % 60;
	return sprintf( '%02d:%02d', $h, $m );
}

/**
 * Add shortcode for booking form
 */
function appointment_booking_shortcode( $atts ) {
	$atts = shortcode_atts( array(
		'title' => 'Book an Appointment',
	), $atts );
	
	ob_start();
	?>
	<div id="appointment-booking-form">
		<h3><?php echo esc_html( $atts['title'] ); ?></h3>
		<div class="appointment-loading">Loading booking form...</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'appointment_booking', 'appointment_booking_shortcode' );
