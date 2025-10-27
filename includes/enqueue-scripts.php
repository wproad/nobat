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

	// Determine which script to load based on the specific admin page
	$script_name = null;
	$style_name = null;
	
	// Load calendar scripts for both main calendar page (page=nobat) and schedule-specific calendar (page=nobat-cal)
	if ( strpos( $admin_page, 'nobat-cal' ) !== false || $admin_page === 'toplevel_page_nobat' ) {
		$script_name = 'cal';
		$style_name = 'cal';
	}
	// Use 'schedule' assets for the create/edit schedule page
	elseif ( strpos( $admin_page, 'nobat-scheduling' ) !== false ) {
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
	// Schedules list page and other admin pages don't need React scripts
	else {
		return;
	}

	// Use file modification time as version for cache busting
	$js_file = NOBAT_PLUGIN_DIR . "build/{$script_name}.js";
	$css_file = NOBAT_PLUGIN_DIR . "build/{$style_name}.css";
	$version = file_exists( $js_file ) ? filemtime( $js_file ) : NOBAT_VERSION;

	// Enqueue our standalone React bundle (no WordPress dependencies)
	wp_enqueue_script(
		"nobat-{$script_name}-script",
		NOBAT_PLUGIN_URL . "build/{$script_name}.js",
		array(), // No dependencies - everything is bundled
		$version,
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the admin handle
	wp_set_script_translations( "nobat-{$script_name}-script", 'nobat', NOBAT_PLUGIN_DIR . 'languages' );
	
	// Localize script with REST API nonce and translations
	wp_localize_script( "nobat-{$script_name}-script", 'wpApiSettings', array(
		'root' => esc_url_raw( rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
	) );

	// Enqueue styles
	wp_enqueue_style(
		"appointment-booking-{$style_name}-style",
		NOBAT_PLUGIN_URL . "build/{$style_name}.css",
		array(), // No dependencies - everything is bundled
		$version,
	);
}
add_action( 'admin_enqueue_scripts', 'nobat_admin_enqueue_scripts' );

/**
 * Enqueues frontend booking form scripts
 * Only loads when the shortcode is present
 */
function nobat_frontend_enqueue_scripts() {
	// Only enqueue if we're on a page/post that contains our shortcode
	global $post;
	if ( ! $post || ! has_shortcode( $post->post_content, 'nobat_booking' ) ) {
		return;
	}

	// Use file modification time as version for cache busting
	$js_file = NOBAT_PLUGIN_DIR . 'build/booking.js';
	$css_file = NOBAT_PLUGIN_DIR . 'build/booking.css';
	$version = file_exists( $js_file ) ? filemtime( $js_file ) : NOBAT_VERSION;

	// Enqueue our standalone React bundle (no WordPress dependencies)
	wp_enqueue_script(
		'nobat-frontend-script',
		NOBAT_PLUGIN_URL . 'build/booking.js',
		array(), // No dependencies - everything is bundled
		$version,
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the frontend handle
	wp_set_script_translations( 'nobat-frontend-script', 'nobat', NOBAT_PLUGIN_DIR . 'languages' );

	// Localize script with REST API nonce and user data
	wp_localize_script( 'nobat-frontend-script', 'wpApiSettings', array(
		'root' => esc_url_raw( rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
	) );

	// Enqueue styles
	wp_enqueue_style(
		'nobat-frontend-style',
		NOBAT_PLUGIN_URL . 'build/booking.css',
		array(), // No dependencies - everything is bundled
		$version,
	);
}
add_action( 'wp_enqueue_scripts', 'nobat_frontend_enqueue_scripts' );

/**
 * Enqueues front.js for pages that need it
 * Checks if page has an element with id 'nobat-new'
 */
function nobat_front_enqueue_scripts() {
	global $post;
	
	// Check if we need to enqueue front.js
	$should_enqueue = false;
	
	// Check if we're on a page/post
	if ( $post ) {
		// Check if post content contains 'nobat-new' id or has a specific container
		if ( strpos( $post->post_content, 'nobat-new' ) !== false || 
			 has_shortcode( $post->post_content, 'nobat_front' ) ) {
			$should_enqueue = true;
		}
	}
	
	// Also check if current page has the nobat-new element in body class or other indicators
	if ( ! $should_enqueue && ( is_page() || is_single() || is_front_page() ) ) {
		$should_enqueue = true; // Load on all pages for now, can be optimized later
	}
	
	if ( ! $should_enqueue ) {
		return;
	}

	// Use file modification time as version for cache busting
	$js_file = NOBAT_PLUGIN_DIR . 'build/front.js';
	$css_file = NOBAT_PLUGIN_DIR . 'build/front.css';
	$version = file_exists( $js_file ) ? filemtime( $js_file ) : NOBAT_VERSION;

	// Enqueue our standalone React bundle (no WordPress dependencies)
	wp_enqueue_script(
		'nobat-front-script',
		NOBAT_PLUGIN_URL . 'build/front.js',
		array(), // No dependencies - everything is bundled
		$version,
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the front handle
	wp_set_script_translations( 'nobat-front-script', 'nobat', NOBAT_PLUGIN_DIR . 'languages' );

	// Localize script with REST API nonce and user data
	wp_localize_script( 'nobat-front-script', 'wpApiSettings', array(
		'root' => esc_url_raw( rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
	) );

	// Enqueue styles
	wp_enqueue_style(
		'nobat-front-style',
		NOBAT_PLUGIN_URL . 'build/front.css',
		array(), // No dependencies - everything is bundled
		$version,
	);
}
add_action( 'wp_enqueue_scripts', 'nobat_front_enqueue_scripts' );
