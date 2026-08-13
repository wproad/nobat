<?php
/**
 * Plugin activation and database management
 *
 * @package Nobat
 */

use Nobat\Core\DatabaseManager;
use Nobat\Utilities\Logger;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Activation callback
 */
function nobat_activate() {
	nobat_update_database();
}

/**
 * Check and update database on plugin load
 */
function nobat_check_database() {
	try {
		$db_manager = new DatabaseManager();

		if ( $db_manager->needs_update() ) {
			Logger::debug( 'Nobat: Running database schema update...' );
			$db_manager->update_database();
			Logger::debug( 'Nobat: Database updated to version ' . DatabaseManager::DB_VERSION );
		}
	} catch ( Exception $e ) {
		error_log( 'Nobat: Database check error - ' . $e->getMessage() );
	}
}
add_action( 'plugins_loaded', 'nobat_check_database' );

/**
 * Update database schema
 */
function nobat_update_database() {
	$db_manager = new DatabaseManager();
	$db_manager->update_database();
}
