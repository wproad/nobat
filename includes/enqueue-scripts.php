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
function nobat_admin_enqueue_scripts( $admin_page ) {
    // Load assets only on our plugin pages; be flexible about the exact suffix
    if ( strpos( $admin_page, 'nobat' ) === false ) {
        return;
    }

	// Determine which script to load
	$script_name = 'admin';
	$style_name = 'admin';
	
	// Load calendar scripts for both main calendar page (page=nobat) and schedule-specific calendar (page=nobat-cal)
	if ( strpos( $admin_page, 'nobat-cal' ) !== false || $admin_page === 'toplevel_page_nobat' ) {
		$script_name = 'cal';
		$style_name = 'cal';
	}

	    // Use 'schedule' assets for the schedule page
    if ( strpos( $admin_page, 'nobat-scheduling' ) !== false ) {
        $script_name = 'schedule';
        $style_name = 'schedule';

		 // Enqueue Jalali Datepicker assets only for this page
		 wp_enqueue_style(
			'jalalidatepicker-style',
			NOBAT_PLUGIN_URL . 'dist/jalalidatepicker.min.css',
			array(),
			'1.0.0'
		);
	
		wp_enqueue_script(
			'jalalidatepicker-script',
			NOBAT_PLUGIN_URL . 'dist/jalalidatepicker.min.js',
			array(),
			'1.0.0',
			true
		);

    }

	$asset_file = NOBAT_PLUGIN_DIR . "build/{$script_name}.asset.php";

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	// Ensure wp-i18n is available for translatable JS strings
	if ( empty( $asset['dependencies'] ) || ! in_array( 'wp-i18n', $asset['dependencies'], true ) ) {
		$asset['dependencies'][] = 'wp-i18n';
	}

	wp_enqueue_script(
		"nobat-{$script_name}-script",
		NOBAT_PLUGIN_URL . "build/{$script_name}.js",
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the admin handle
	wp_set_script_translations( "nobat-{$script_name}-script", 'nobat', NOBAT_PLUGIN_DIR . 'languages' );

	// Enqueue WordPress REST API script for nonce
	wp_enqueue_script( 'wp-api' );
	
	// Localize script with REST API nonce
	wp_localize_script( "nobat-{$script_name}-script", 'wpApiSettings', array(
		'root' => esc_url_raw( rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
	) );

	wp_enqueue_style(
		"appointment-booking-{$style_name}-style",
		NOBAT_PLUGIN_URL . "build/{$style_name}.css",
		array_filter(
			$asset['dependencies'],
			function ( $style ) {
				return wp_style_is( $style, 'registered' );
			}
		),
		$asset['version'],
	);
}
add_action( 'admin_enqueue_scripts', 'nobat_admin_enqueue_scripts' );

/**
 * Enqueues frontend booking form scripts
 */
function nobat_frontend_enqueue_scripts() {
	$asset_file = NOBAT_PLUGIN_DIR . 'build/booking.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	// Ensure wp-i18n is available for translatable JS strings
	if ( empty( $asset['dependencies'] ) || ! in_array( 'wp-i18n', $asset['dependencies'], true ) ) {
		$asset['dependencies'][] = 'wp-i18n';
	}

	wp_enqueue_script(
		'nobat-frontend-script',
		NOBAT_PLUGIN_URL . 'build/booking.js',
		$asset['dependencies'],
		$asset['version'],
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the frontend handle
	wp_set_script_translations( 'nobat-frontend-script', 'nobat', NOBAT_PLUGIN_DIR . 'languages' );

	wp_enqueue_style(
		'nobat-frontend-style',
		NOBAT_PLUGIN_URL . 'build/booking.css',
		array_filter(
			$asset['dependencies'],
			function ( $style ) {
				return wp_style_is( $style, 'registered' );
			}
		),
		$asset['version'],
	);
}
add_action( 'wp_enqueue_scripts', 'nobat_frontend_enqueue_scripts' );

/**
 * Enqueues React frontend app scripts when shortcode is used
 */
function nobat_react_frontend_enqueue_scripts() {
	// Only enqueue if we're on a page/post that contains our shortcode
	global $post;
	if ( ! $post || ! has_shortcode( $post->post_content, 'nobat_frontend' ) ) {
		return;
	}

	// Load manifest.json to get the correct file names
	$manifest_path = NOBAT_PLUGIN_DIR . 'build/manifest.json';
	if ( ! file_exists( $manifest_path ) ) {
		return;
	}

	$manifest = json_decode( file_get_contents( $manifest_path ), true );
	if ( ! $manifest || ! isset( $manifest['src/main.jsx'] ) ) {
		return;
	}

	$frontend_entry = $manifest['src/main.jsx'];
	$frontend_js = NOBAT_PLUGIN_URL . 'build/' . $frontend_entry['file'];

	// Enqueue React app script
	wp_enqueue_script(
		'appointment-booking-react-frontend',
		$frontend_js,
		array(), // No dependencies for now, Vite handles bundling
		NOBAT_VERSION,
		array(
			'in_footer' => true,
		)
	);

	// Localize current user data for frontend
	$current_user = wp_get_current_user();
	wp_localize_script( 'appointment-booking-react-frontend', 'wpUser', array(
		'ID' => $current_user->ID,
		'display_name' => $current_user->display_name,
		'user_email' => $current_user->user_email,
		'isLoggedIn' => is_user_logged_in(),
	) );

	// Enqueue CSS files if they exist
	if ( isset( $frontend_entry['css'] ) && is_array( $frontend_entry['css'] ) ) {
		foreach ( $frontend_entry['css'] as $css_file ) {
			wp_enqueue_style(
				'appointment-booking-react-frontend-style-' . sanitize_title( basename( $css_file, '.css' ) ),
				NOBAT_PLUGIN_URL . 'build/' . $css_file,
				array(),
				NOBAT_VERSION
			);
		}
	}

	// Also enqueue any other assets (like SVG files)
	if ( isset( $frontend_entry['assets'] ) && is_array( $frontend_entry['assets'] ) ) {
		foreach ( $frontend_entry['assets'] as $asset_file ) {
			// You can handle different asset types here if needed
		}
	}

	// Add initialization script
	wp_add_inline_script( 'appointment-booking-react-frontend', '
		document.addEventListener("DOMContentLoaded", function() {
			// Initialize React app for all shortcode containers
			const containers = document.querySelectorAll("[data-shortcode=\'nobat_frontend\']");
			containers.forEach(function(container) {
				if (window.AppointmentBookingApp && window.AppointmentBookingApp.init) {
					window.AppointmentBookingApp.init(container.id);
				}
			});
		});
	' );
}
add_action( 'wp_enqueue_scripts', 'nobat_react_frontend_enqueue_scripts' );
