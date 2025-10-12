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
function appointment_booking_admin_page() {
	add_menu_page(
        __( 'Appointments', 'appointment-booking' ),
        __( 'Appointments', 'appointment-booking' ),
        'manage_options',
        'appointment-booking',
        'appointment_list_page_callback',
        'dashicons-calendar-alt',
        20
    );

    add_submenu_page(
        'appointment-booking',
        __( 'All Appointments', 'appointment-booking' ),
        __( 'All Appointments', 'appointment-booking' ),
        'manage_options',
        'appointment-booking',
        'appointment_list_page_callback'
    );

    add_submenu_page(
        'appointment-booking',
        __( 'Add New', 'appointment-booking' ),
        __( 'Add New', 'appointment-booking' ),
        'manage_options',
        'appointment_add_new',
        'appointment_add_new_page_callback'
    );

	// Add calendar subpage
	add_submenu_page(
		'appointment-booking',
		__( 'Calendar View', 'appointment-booking' ),
		__( 'Calendar', 'appointment-booking' ),
		'manage_options',
		'appointment-booking-calendar',
		'appointment_booking_calendar_page_html'
	);

	// Add settings subpage
	add_submenu_page(
		'appointment-booking',
		__( 'Settings', 'appointment-booking' ),
		__( 'Settings', 'appointment-booking' ),
		'manage_options',
		'appointment-booking-settings',
		'appointment_booking_settings_page_html'
	);

    // Add scheduling sub page
    add_submenu_page(
		'appointment-booking',
		__( 'Scheduling', 'appointment-booking' ),
		__( 'Schedulings', 'appointment-booking' ),
		'manage_options',
		'appointment-booking-scheduling',
		'appointment_booking_scheduling_page_html'
	);

}
add_action( 'admin_menu', 'appointment_booking_admin_page' );