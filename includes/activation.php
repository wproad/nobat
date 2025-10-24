<?php
/**
 * Plugin activation and database management
 *
 * @package Nobat
 */

use Nobat\Core\DatabaseManager;

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
		
		$current_version = $db_manager->get_current_version();
		$needs_update = $db_manager->needs_update();
		
		error_log( sprintf(
			'Nobat DB Check: Current=%s, Required=%s, NeedsUpdate=%s',
			$current_version,
			DatabaseManager::DB_VERSION,
			$needs_update ? 'YES' : 'NO'
		) );
		
		if ( $needs_update ) {
			error_log( 'Nobat: Running database schema update...' );
			$result = $db_manager->update_database();
			error_log( 'Nobat: Database updated to version ' . DatabaseManager::DB_VERSION );
			
			// Verify tables were created
			$tables = $db_manager->check_tables();
			error_log( 'Nobat: Table status - ' . print_r( $tables, true ) );
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
