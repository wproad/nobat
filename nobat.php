<?php
/**
 * Plugin Name: Nobat
 * Plugin URI: https://github.com/wproad/nobat
 * Description: A modern appointment booking system with admin management.
 * Version: 2.2.0
 * Requires at least: 6.1
 * Requires PHP: 8.0
 * Author: WPROAD
 * Author URI: https://wproad.ir/nobat
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain: nobat
 * Domain Path: /languages
 *
 * @package Nobat
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants
const NOBAT_VERSION = '2.2.0';
define( 'NOBAT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'NOBAT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load Composer autoloader
require_once NOBAT_PLUGIN_DIR . 'vendor/autoload.php';

// Bootstrap application (loads container and all dependencies)
require_once NOBAT_PLUGIN_DIR . 'includes/bootstrap.php';

// Initialize container
nobat_bootstrap();

// Include activation file first
require_once NOBAT_PLUGIN_DIR . 'includes/activation.php';

// Include the rest of the plugin files
require_once NOBAT_PLUGIN_DIR . 'includes/admin-menu.php';
require_once NOBAT_PLUGIN_DIR . 'includes/admin-page.php';
require_once NOBAT_PLUGIN_DIR . 'includes/admin-settings.php';
require_once NOBAT_PLUGIN_DIR . 'includes/enqueue-scripts.php';
require_once NOBAT_PLUGIN_DIR . 'includes/helpers.php';

// Register activation hook
register_activation_hook( __FILE__, 'nobat_activate' );

/**
 * Register REST API routes
 */
function nobat_register_routes() {
	$router = nobat_service( 'router' );
	$router->register_routes();
}
add_action( 'rest_api_init', 'nobat_register_routes' );

/**
 * Register shortcodes
 */
function nobat_register_shortcodes() {
	$shortcode_handler = nobat_service( 'shortcode_handler' );
	$shortcode_handler->register();
}
add_action( 'init', 'nobat_register_shortcodes' );

/**
 * Load plugin text domain for translations
 */
function nobat_load_textdomain() {
	load_plugin_textdomain(
		'nobat',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', 'nobat_load_textdomain' );

