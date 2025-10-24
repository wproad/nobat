<?php
/**
 * Registers admin menu and submenu pages
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Registers the admin page for viewing appointments
 */
function nobat_admin_page() {
	// Main menu - opens Calendar by default
	add_menu_page(
        __( 'Nobat', 'nobat' ),
        __( 'Nobat', 'nobat' ),
        'manage_options',
        'nobat',
        'nobat_cal_page_html',
        'dashicons-calendar-alt',
        20
    );

	// Add calendar subpage - First position (same slug as parent)
	add_submenu_page(
		'nobat',
		__( 'Calendar', 'nobat' ),
		__( 'Calendar', 'nobat' ),
		'manage_options',
		'nobat',
		'nobat_cal_page_html'
	);

    add_submenu_page(
        'nobat',
        __( 'All Appointments', 'nobat' ),
        __( 'All Appointments', 'nobat' ),
        'manage_options',
        'nobat-appointments',
        'appointment_list_page_callback'
    );

	// Add settings subpage
	add_submenu_page(
		'nobat',
		__( 'Settings', 'nobat' ),
		__( 'Settings', 'nobat' ),
		'manage_options',
		'nobat-settings',
		'nobat_settings_page_html'
	);

	// Add all schedules sub page
	add_submenu_page(
		'nobat',
		__( 'All Schedules', 'nobat' ),
		__( 'Schedules', 'nobat' ),
		'manage_options',
		'nobat-schedules',
		'schedule_list_page_callback'
	);

    // Add scheduling page (hidden from menu - accessed via "Add New" button on schedules list)
    add_submenu_page(
		null, // Parent slug null = hidden from menu
		__( 'Add Schedule', 'nobat' ),
		__( 'Add Schedule', 'nobat' ),
		'manage_options',
		'nobat-scheduling',
		'nobat_scheduling_page_html'
	);

}
add_action( 'admin_menu', 'nobat_admin_page' );