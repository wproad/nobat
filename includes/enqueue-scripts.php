<?php
/**
 * Enqueue scripts and styles for the plugin
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Get current user data for frontend
 *
 * @return array User data.
 */
function nobat_get_current_user_data() {
	if ( ! is_user_logged_in() ) {
		return array(
			'id' => 0,
			'name' => '',
			'email' => '',
		);
	}

	$current_user = wp_get_current_user();

	return array(
		'id' => $current_user->ID,
		'name' => $current_user->display_name,
		'email' => $current_user->user_email,
	);
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

	// Soft Slot font fallback (host/admin font wins via inherit)
	wp_enqueue_style(
		'nobat-vazirmatn',
		'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600&display=swap',
		array(),
		null
	);

	// Enqueue styles
	$style_handle = "appointment-booking-{$style_name}-style";
	wp_enqueue_style(
		$style_handle,
		NOBAT_PLUGIN_URL . "build/{$style_name}.css",
		array( 'nobat-vazirmatn' ),
		$version,
	);

	// Soft Slot accent knobs on custom admin React screens only
	$colors = function_exists( 'nobat_get_brand_colors' )
		? nobat_get_brand_colors()
		: array(
			'accent' => '#2A9B9B',
			'on'     => '#FCFCFC',
			'soft'   => '#E6F3F3',
			'hover'  => '#217A7A',
		);

	$accent_css = sprintf(
		'.bf-root{--accent:%1$s;--accent-on:%2$s;--accent-soft:%3$s;--accent-hover:%4$s;--focus-ring:0 0 0 3px color-mix(in oklab, %1$s, transparent 70%%);}',
		$colors['accent'],
		$colors['on'],
		$colors['soft'],
		$colors['hover']
	);
	wp_add_inline_style( $style_handle, $accent_css );
}
add_action( 'admin_enqueue_scripts', 'nobat_admin_enqueue_scripts' );

/**
 * Enqueues bookingNew.js for pages that need it
 * Checks if page has the nobat_booking or nobat_new shortcode
 */
function nobat_front_enqueue_scripts() {
	global $post;

	if ( ! $post ) {
		return;
	}

	$should_enqueue =
		has_shortcode( $post->post_content, 'nobat_booking' ) ||
		has_shortcode( $post->post_content, 'nobat_new' ) ||
		strpos( $post->post_content, 'nobat-new' ) !== false;

	if ( ! $should_enqueue ) {
		return;
	}

	// Use file modification time as version for cache busting
	$js_file = NOBAT_PLUGIN_DIR . 'build/bookingNew.js';
	$css_file = NOBAT_PLUGIN_DIR . 'build/bookingNew.css';
	$version = file_exists( $js_file ) ? filemtime( $js_file ) : NOBAT_VERSION;

	// Enqueue our standalone React bundle (no WordPress dependencies)
	wp_enqueue_script(
		'nobat-front-script',
		NOBAT_PLUGIN_URL . 'build/bookingNew.js',
		array(), // No dependencies - everything is bundled
		$version,
		array(
			'in_footer' => true,
		)
	);

	// Load JS translations for the front handle
	wp_set_script_translations( 'nobat-front-script', 'nobat', NOBAT_PLUGIN_DIR . 'languages' );

	// Localize script with REST API nonce and user data
	// wp_localize_script( 'nobat-front-script', 'wpApiSettings', array(
	// 	'root' => esc_url_raw( rest_url() ),
	// 	'nonce' => wp_create_nonce( 'wp_rest' ),
	// ) );

	// Add authentication data for front section
	wp_localize_script( 'nobat-front-script', 'wpApiSettings', array(
		'isLoggedIn' => is_user_logged_in(),
		'currentUser' => nobat_get_current_user_data(),
		'loginUrl' => wp_login_url( get_permalink() ),
		'root' => esc_url_raw( rest_url() ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
		'registerUrl' => wp_login_url( get_permalink() ) . '?action=register',
		'reservationMessage' => get_option( 'nobat_success_message', '' ),
	) );

	// Soft Slot font fallback (host font wins via inherit)
	wp_enqueue_style(
		'nobat-vazirmatn',
		'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600&display=swap',
		array(),
		null
	);

	// Enqueue styles
	wp_enqueue_style(
		'nobat-front-style',
		NOBAT_PLUGIN_URL . 'build/bookingNew.css',
		array( 'nobat-vazirmatn' ),
		$version,
	);

	// Admin-configurable Soft Slot accent knobs (--accent*)
	$colors = function_exists( 'nobat_get_brand_colors' )
		? nobat_get_brand_colors()
		: array(
			'accent' => '#2A9B9B',
			'on'     => '#FCFCFC',
			'soft'   => '#E6F3F3',
			'hover'  => '#217A7A',
		);

	$accent_css = sprintf(
		'.bf-root{--accent:%1$s;--accent-on:%2$s;--accent-soft:%3$s;--accent-hover:%4$s;--focus-ring:0 0 0 3px color-mix(in oklab, %1$s, transparent 70%%);}',
		$colors['accent'],
		$colors['on'],
		$colors['soft'],
		$colors['hover']
	);
	wp_add_inline_style( 'nobat-front-style', $accent_css );
}
add_action( 'wp_enqueue_scripts', 'nobat_front_enqueue_scripts' );

/**
 * Enqueue WP color picker on Nobat settings page.
 *
 * @param string $admin_page Current admin page hook.
 */
function nobat_settings_enqueue_scripts( $admin_page ) {
	if ( strpos( $admin_page, 'nobat-settings' ) === false ) {
		return;
	}

	wp_enqueue_style( 'wp-color-picker' );
	wp_enqueue_script( 'wp-color-picker' );
	wp_add_inline_script(
		'wp-color-picker',
		"jQuery(function($){ $('.nobat-brand-color-field').wpColorPicker(); });"
	);
}
add_action( 'admin_enqueue_scripts', 'nobat_settings_enqueue_scripts' );
