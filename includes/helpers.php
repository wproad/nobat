<?php
/**
 * Helper / utility functions used across the plugin
 * 
 * NOTE: These are legacy wrapper functions for backward compatibility.
 * New code should use the utility classes directly:
 * - Nobat\Utilities\DateTimeHelper
 * - Nobat\Utilities\Validator
 * - Nobat\Utilities\SlotGenerator
 */

use Nobat\Utilities\DateTimeHelper;
use Nobat\Utilities\Validator;
use Nobat\Utilities\SlotGenerator;

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Return the full-day slot template (includes breaks as rows)
 */
function nobat_get_slot_template() {
	// Build template with excluded flags
	$interval = (int) get_option( 'appointment_booking_slot_interval', 60 );
	$start = (string) get_option( 'appointment_booking_day_start', '09:00' );
	$end = (string) get_option( 'appointment_booking_day_end', '17:00' );
	$breaks_raw = (string) get_option( 'appointment_booking_breaks', '12:00-14:00' );

	$break_ranges = array();
	foreach ( preg_split( '/\r\n|\r|\n/', $breaks_raw ) as $line ) {
		$line = trim( $line );
		if ( $line === '' ) { continue; }
		list( $bStart, $bEnd ) = array_map( 'trim', explode( '-', $line ) );
		$break_ranges[] = array( $bStart, $bEnd );
	}

	$template = array();
	$cursor = appointment_booking_time_to_minutes( $start );
	$end_minutes = appointment_booking_time_to_minutes( $end );
	while ( $cursor + $interval <= $end_minutes ) {
		$slot_start = $cursor;
		$slot_end = $cursor + $interval;
		$label = appointment_booking_minutes_to_time( $slot_start ) . '-' . appointment_booking_minutes_to_time( $slot_end );
		$in_break = false;
		foreach ( $break_ranges as $br ) {
			list( $bs, $be ) = $br;
			$bs_m = appointment_booking_time_to_minutes( $bs );
			$be_m = appointment_booking_time_to_minutes( $be );
			if ( $slot_start < $be_m && $slot_end > $bs_m ) {
				$in_break = true;
				break;
			}
		}
		$template[] = array(
			'label' => $label,
			'excluded' => $in_break,
		);
		$cursor += $interval;
	}

	return new WP_REST_Response( $template, 200 );
}

/**
 * Generate time slots from settings.
 * 
 * @deprecated Use Nobat\Utilities\SlotGenerator::generate_slots_from_settings() instead
 *
 * @param bool $include_breaks If true, includes slots within breaks (for calendar layout). If false, excludes them (for availability).
 * @return array List of slot strings like "09:00-10:00".
 */
function nobat_generate_slots_from_settings( $include_breaks = false ) {
	return Nobat\Utilities\SlotGenerator::generate_slots_from_settings( $include_breaks );
}

/**
 * @deprecated Use Nobat\Utilities\DateTimeHelper::time_to_minutes() instead
 */
function nobat_time_to_minutes( $hhmm ) {
	return Nobat\Utilities\DateTimeHelper::time_to_minutes( $hhmm );
}

/**
 * @deprecated Use Nobat\Utilities\DateTimeHelper::minutes_to_time() instead
 */
function nobat_minutes_to_time( $minutes ) {
	return Nobat\Utilities\DateTimeHelper::minutes_to_time( $minutes );
}

/**
 * Legacy shortcode function (deprecated)
 * 
 * @deprecated Use ShortcodeHandler class instead
 * Kept for backward compatibility, but shortcodes are now registered via Nobat\Core\ShortcodeHandler
 */

/**
 * Sanitize time in HH:MM (24h)
 * 
 * @deprecated Use Nobat\Utilities\Validator::sanitize_time() instead
 */
function nobat_sanitize_time_hhmm( $time ) {
	return Nobat\Utilities\Validator::sanitize_time( $time );
}

/**
 * Convert Jalali date to Gregorian date using wp-parsidate plugin if available
 * 
 * @deprecated Use Nobat\Utilities\DateTimeHelper::jalali_to_gregorian() instead
 * 
 * @param string $jalaliDate Date in format YYYY/MM/DD
 * @return string|false Gregorian date in Y-m-d format or false on error
 */
function convertJalaliToGregorian( $jalaliDate ) {
	return Nobat\Utilities\DateTimeHelper::jalali_to_gregorian( $jalaliDate );
}

/**
 * Convert Persian/Farsi digits to English digits
 * 
 * @deprecated Use Nobat\Utilities\DateTimeHelper::convert_persian_digits_to_english() instead
 * 
 * @param string $string String containing Persian digits
 * @return string String with English digits
 */
function convertPersianDigitsToEnglish( $string ) {
	return Nobat\Utilities\DateTimeHelper::convert_persian_digits_to_english( $string );
}

/**
 * Legacy frontend shortcode (deprecated)
 * 
 * @deprecated Shortcodes are now registered via Nobat\Core\ShortcodeHandler
 */