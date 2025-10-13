<?php
/**
 * Handles plugin activation and database table creation
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Create appointments table on plugin activation
 */
function appointment_booking_activate() {
	global $wpdb;
	
	// 1. appointments table
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

	// 2. schedules table
	$table_name = $wpdb->prefix . 'schedules';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        admin_id bigint(20) NOT NULL,
        is_active tinyint(1) DEFAULT 1,
        start_day date NOT NULL,
        end_day date NOT NULL,
        meeting_duration int NOT NULL DEFAULT 30,
        buffer int NOT NULL DEFAULT 0,
        weekly_hours longtext NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        KEY admin_id (admin_id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
	
	// Add version option
	add_option( 'appointment_booking_version', '1.0.0' );
}
