<?php
/**
 * Enqueue scripts and styles for the plugin
 */

if ( ! defined('ABSPATH') ) {
	exit;
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
	
	if ( strpos( $admin_page, 'appointment-booking-cal' ) !== false ) {
		$script_name = 'cal';
		$style_name = 'cal';
	}

	    // Use 'schedule' assets for the schedule page
    if ( strpos( $admin_page, 'appointment-booking-scheduling' ) !== false ) {
        $script_name = 'schedule';
        $style_name = 'schedule';

		 // Enqueue Jalali Datepicker assets only for this page
		 wp_enqueue_style(
			'jalalidatepicker-style',
			APPOINTMENT_BOOKING_PLUGIN_URL . 'dist/jalalidatepicker.min.css',
			array(),
			'1.0.0'
		);
	
		wp_enqueue_script(
			'jalalidatepicker-script',
			APPOINTMENT_BOOKING_PLUGIN_URL . 'dist/jalalidatepicker.min.js',
			array(),
			'1.0.0',
			true
		);

    }
	$asset_file = APPOINTMENT_BOOKING_PLUGIN_DIR . "build/{$script_name}.asset.php";

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	// Ensure wp-i18n is available for translatable JS strings
	if ( empty( $asset['dependencies'] ) || ! in_array( 'wp-i18n', $asset['dependencies'], true ) ) {
		$asset['dependencies'][] = 'wp-i18n';
	}

	wp_enqueue_script(
		"appointment-booking-{$script_name}-script",
		APPOINTMENT_BOOKING_PLUGIN_URL . "build/{$script_name}.js",
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the admin handle
	wp_set_script_translations( "appointment-booking-{$script_name}-script", 'appointment-booking', APPOINTMENT_BOOKING_PLUGIN_DIR . 'languages' );

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
	$asset_file = APPOINTMENT_BOOKING_PLUGIN_DIR . 'build/booking.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	// Ensure wp-i18n is available for translatable JS strings
	if ( empty( $asset['dependencies'] ) || ! in_array( 'wp-i18n', $asset['dependencies'], true ) ) {
		$asset['dependencies'][] = 'wp-i18n';
	}

	wp_enqueue_script(
		'appointment-booking-frontend-script',
		APPOINTMENT_BOOKING_PLUGIN_URL . 'build/booking.js',
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the frontend handle
	wp_set_script_translations( 'appointment-booking-frontend-script', 'appointment-booking', APPOINTMENT_BOOKING_PLUGIN_DIR . 'languages' );

	wp_enqueue_style(
		'appointment-booking-frontend-style',
		APPOINTMENT_BOOKING_PLUGIN_URL . 'build/booking.css',
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
