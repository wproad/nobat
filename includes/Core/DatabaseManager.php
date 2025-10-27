<?php
/**
 * Database Manager
 * 
 * Simple database version checker and schema updater
 * No complex migrations needed - just create/update tables as needed
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class DatabaseManager {
	
	/**
	 * Current database version
	 */
	const DB_VERSION = '4.3'; // v4.3: Added slot_date_jalali field to slots table
	
	/**
	 * Database version option name
	 */
	const DB_VERSION_OPTION = 'nobat_db_version';
	
	/**
	 * Legacy database version option name (for migration)
	 */
	const OLD_DB_VERSION_OPTION = 'appointment_booking_db_version';
	
	/**
	 * WordPress database object
	 *
	 * @var wpdb
	 */
	private $wpdb;
	
	/**
	 * Table prefix
	 *
	 * @var string
	 */
	private $prefix;
	
	/**
	 * Constructor
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
		$this->prefix = $wpdb->prefix;
	}
	
	/**
	 * Check if database needs update
	 *
	 * Includes migration logic from old option name
	 *
	 * @return bool
	 */
	public function needs_update() {
		// Check for migration from old option
		$current_version = get_option( self::DB_VERSION_OPTION, null );
		
		if ( $current_version === null ) {
			// Check if old option exists
			$old_version = get_option( self::OLD_DB_VERSION_OPTION, null );
			
			if ( $old_version !== null ) {
				// Migrate from old option to new
				update_option( self::DB_VERSION_OPTION, $old_version );
				$current_version = $old_version;
			} else {
				$current_version = '0.0.0';
			}
		}
		
		return version_compare( $current_version, self::DB_VERSION, '<' );
	}
	
	/**
	 * Update database schema
	 *
	 * @return bool Success
	 */
	public function update_database() {
		error_log( 'Nobat DatabaseManager: Starting database update...' );
		
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		
		$charset_collate = $this->wpdb->get_charset_collate();
		error_log( 'Nobat DatabaseManager: Charset collate = ' . $charset_collate );
		
		// Create/update all tables
		error_log( 'Nobat DatabaseManager: Creating schedules table...' );
		$this->create_schedules_table( $charset_collate );
		
		error_log( 'Nobat DatabaseManager: Creating working_hours table...' );
		$this->create_working_hours_table( $charset_collate );
		
		error_log( 'Nobat DatabaseManager: Creating slots table...' );
		$this->create_slots_table( $charset_collate );
		
		error_log( 'Nobat DatabaseManager: Creating appointments table...' );
		$this->create_appointments_table( $charset_collate );
		
		error_log( 'Nobat DatabaseManager: Creating history table...' );
		$this->create_history_table( $charset_collate );
		
		// Run migrations for existing data
		error_log( 'Nobat DatabaseManager: Running data migrations...' );
		$this->run_data_migrations();
		
		// Update version
		error_log( 'Nobat DatabaseManager: Updating version option to ' . self::DB_VERSION );
		update_option( self::DB_VERSION_OPTION, self::DB_VERSION );
		
		error_log( 'Nobat DatabaseManager: Database update completed successfully' );
		
		return true;
	}
	
	/**
	 * Create schedules table
	 *
	 * @param string $charset_collate
	 */
	private function create_schedules_table( $charset_collate ) {
		$table_name = $this->prefix . 'nobat_schedules';
		
		$sql = "CREATE TABLE $table_name (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			is_active tinyint(1) DEFAULT 0,
			start_date date NOT NULL,
			end_date date NOT NULL,
			meeting_duration int NOT NULL DEFAULT 30,
			buffer_time int NOT NULL DEFAULT 0,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY is_active (is_active),
			KEY date_range (start_date, end_date)
		) $charset_collate;";
		
		dbDelta( $sql );
	}
	
	/**
	 * Create working hours table
	 *
	 * @param string $charset_collate
	 */
	private function create_working_hours_table( $charset_collate ) {
		$table_name = $this->prefix . 'nobat_working_hours';
		
		$sql = "CREATE TABLE $table_name (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			schedule_id bigint(20) NOT NULL,
			day_of_week varchar(10) NOT NULL,
			start_time time NOT NULL,
			end_time time NOT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY schedule_id (schedule_id),
			KEY schedule_day (schedule_id, day_of_week)
		) $charset_collate;";
		
		dbDelta( $sql );
	}
	
	/**
	 * Create appointment slots table
	 *
	 * @param string $charset_collate
	 */
	private function create_slots_table( $charset_collate ) {
		$table_name = $this->prefix . 'nobat_slots';
		
		$sql = "CREATE TABLE $table_name (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			schedule_id bigint(20) NOT NULL,
			slot_date date NOT NULL,
			slot_date_jalali varchar(10) DEFAULT NULL,
			start_time time NOT NULL,
			end_time time NOT NULL,
			status varchar(20) DEFAULT 'available',
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY schedule_date (schedule_id, slot_date),
			KEY status (status),
			KEY date_time (slot_date, start_time),
			KEY jalali_date (slot_date_jalali),
			UNIQUE KEY unique_slot (schedule_id, slot_date, start_time)
		) $charset_collate;";
		
		dbDelta( $sql );
	}
	
	/**
	 * Create appointments table
	 *
	 * @param string $charset_collate
	 */
	private function create_appointments_table( $charset_collate ) {
		$table_name = $this->prefix . 'nobat_appointments';
		
		$sql = "CREATE TABLE $table_name (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			user_id bigint(20) NOT NULL,
			slot_id bigint(20) NOT NULL,
			schedule_id bigint(20) NOT NULL,
			assigned_admin_id bigint(20) DEFAULT NULL,
			note text DEFAULT NULL,
			report text DEFAULT NULL,
			status varchar(20) DEFAULT 'pending',
			cancellation_reason text DEFAULT NULL,
			cancellation_requested_at datetime DEFAULT NULL,
			confirmed_at datetime DEFAULT NULL,
			completed_at datetime DEFAULT NULL,
			cancelled_at datetime DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY user_id (user_id),
			KEY slot_id (slot_id),
			KEY schedule_id (schedule_id),
			KEY assigned_admin_id (assigned_admin_id),
			KEY status (status),
			KEY user_status (user_id, status)
		) $charset_collate;";
		
		dbDelta( $sql );
	}
	
	/**
	 * Create appointment history table
	 *
	 * @param string $charset_collate
	 */
	private function create_history_table( $charset_collate ) {
		$table_name = $this->prefix . 'nobat_history';
		
		$sql = "CREATE TABLE $table_name (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			appointment_id bigint(20) NOT NULL,
			user_id bigint(20) NOT NULL,
			action varchar(50) NOT NULL,
			notes text DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY appointment_id (appointment_id),
			KEY user_id (user_id)
		) $charset_collate;";
		
		dbDelta( $sql );
	}
	
	/**
	 * Get current database version
	 *
	 * @return string
	 */
	public function get_current_version() {
		return get_option( self::DB_VERSION_OPTION, '0.0.0' );
	}
	
	/**
	 * Check if tables exist
	 *
	 * @return array Table existence status
	 */
	public function check_tables() {
		$tables = array(
			'nobat_schedules',
			'nobat_working_hours',
			'nobat_slots',
			'nobat_appointments',
			'nobat_history'
		);
		
		$status = array();
		
		foreach ( $tables as $table ) {
			$table_name = $this->prefix . $table;
			$exists = $this->wpdb->get_var(
				$this->wpdb->prepare(
					"SHOW TABLES LIKE %s",
					$table_name
				)
			);
			$status[ $table ] = (bool) $exists;
		}
		
		return $status;
	}
	
	/**
	 * Run data migrations for existing records
	 */
	private function run_data_migrations() {
		$current_version = $this->get_current_version();
		
		// Migration for v4.3: Populate slot_date_jalali for existing slots
		if ( version_compare( $current_version, '4.3', '<' ) ) {
			$this->migrate_slot_jalali_dates();
		}
	}
	
	/**
	 * Migrate existing slots to include Jalali dates
	 */
	private function migrate_slot_jalali_dates() {
		error_log( 'Nobat DatabaseManager: Migrating slot Jalali dates...' );
		
		// Check if wp-parsidate plugin is available
		if ( ! function_exists( 'parsidate' ) ) {
			error_log( 'Nobat DatabaseManager: wp-parsidate plugin not available, skipping Jalali migration' );
			return;
		}
		
		$table_name = $this->prefix . 'nobat_slots';
		
		// Get all slots that don't have Jalali date
		$slots = $this->wpdb->get_results(
			"SELECT id, slot_date FROM {$table_name} WHERE slot_date_jalali IS NULL OR slot_date_jalali = ''",
			ARRAY_A
		);
		
		if ( empty( $slots ) ) {
			error_log( 'Nobat DatabaseManager: No slots need Jalali date migration' );
			return;
		}
		
		error_log( sprintf( 'Nobat DatabaseManager: Found %d slots to migrate', count( $slots ) ) );
		
		$updated = 0;
		foreach ( $slots as $slot ) {
			$jalali_date = \Nobat\Utilities\DateTimeHelper::gregorian_to_jalali( $slot['slot_date'] );
			
			if ( $jalali_date ) {
				$result = $this->wpdb->update(
					$table_name,
					array( 'slot_date_jalali' => $jalali_date ),
					array( 'id' => $slot['id'] ),
					array( '%s' ),
					array( '%d' )
				);
				
				if ( $result !== false ) {
					$updated++;
				}
			}
		}
		
		error_log( sprintf( 'Nobat DatabaseManager: Updated %d slots with Jalali dates', $updated ) );
	}
}

