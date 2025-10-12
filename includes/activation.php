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
    error_log('Activation function ran');

	global $wpdb;
	
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
	
	// Add version option
	add_option( 'appointment_booking_version', '1.0.0' );
}