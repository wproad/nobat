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
 * Domain Path: /languages

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

// Include activation file first
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/activation.php';

// Include the rest of the plugin files
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/admin-menu.php';
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/admin-page.php';
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/admin-settings.php';
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/rest/register.php';
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/enqueue-scripts.php';
require_once APPOINTMENT_BOOKING_PLUGIN_DIR . 'includes/helpers.php';

// Register activation hook
register_activation_hook( __FILE__, 'appointment_booking_activate' );

function appointment_booking_load_textdomain() {
    load_plugin_textdomain(
        'appointment-booking',
        false,
        dirname( plugin_basename( __FILE__ ) ) . '/languages'
    );

    error_log( 'Locale: ' . determine_locale() );
    error_log( 'Translation loaded: ' . ( is_textdomain_loaded( 'appointment-booking' ) ? 'yes' : 'no' ) );
}
add_action( 'plugins_loaded', 'appointment_booking_load_textdomain' );