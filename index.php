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
	
	// Hardcoded time slots
	$all_slots = array(
		'9:00-10:00',
		'10:00-11:00',
		'11:00-12:00',
		'14:00-15:00',
		'15:00-16:00',
		'16:00-17:00'
	);
	
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
