<?php
/**
 * Date and Time Utility Helper
 *
 * Handles Jalali/Gregorian conversion, time manipulation, and Persian digit handling
 *
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * DateTime Helper class
 */
class DateTimeHelper {

	/**
	 * Convert Jalali date to Gregorian date
	 *
	 * @param string $jalali_date Date in format YYYY/MM/DD or YYYY-MM-DD
	 * @return string|false Gregorian date in Y-m-d format or false on error
	 */
	public static function jalali_to_gregorian( $jalali_date ) {
		// Normalize format (handle both / and - separators)
		$jalali_date = str_replace( '-', '/', $jalali_date );
		
		// Check if wp-parsidate plugin is installed and active
		if ( function_exists( 'gregdate' ) ) {
			try {
				// Use wp-parsidate plugin function
				return gregdate( 'Y-m-d', $jalali_date );
			} catch ( Exception $e ) {
				error_log( 'DateTimeHelper: Jalali to Gregorian conversion failed: ' . $e->getMessage() );
				return false;
			}
		}

		error_log( 'DateTimeHelper: wp-parsidate plugin not available for Jalali conversion' );
		return false;
	}

	/**
	 * Convert Gregorian date to Jalali date
	 *
	 * @param string $gregorian_date Date in Y-m-d format or timestamp
	 * @return string|false Jalali date in YYYY/MM/DD format or false on error
	 */
	public static function gregorian_to_jalali( $gregorian_date ) {
		// Check if wp-parsidate plugin is installed and active
		if ( function_exists( 'parsidate' ) ) {
			try {
				// Use wp-parsidate plugin function
				return self::convert_persian_digits_to_english(
					parsidate( 'Y/m/d', $gregorian_date )
				);
			} catch ( Exception $e ) {
				error_log( 'DateTimeHelper: Gregorian to Jalali conversion failed: ' . $e->getMessage() );
				return false;
			}
		}

		error_log( 'DateTimeHelper: wp-parsidate plugin not available for Jalali conversion' );
		return false;
	}

	/**
	 * Convert Persian/Farsi digits to English digits
	 *
	 * @param string $string String containing Persian digits
	 * @return string String with English digits
	 */
	public static function convert_persian_digits_to_english( $string ) {
		$persian_digits = array( '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' );
		$english_digits = array( '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' );

		return str_replace( $persian_digits, $english_digits, $string );
	}

	/**
	 * Generate Jalali date metadata for a Gregorian date
	 *
	 * @param string $gregorian_date Date in Y-m-d format
	 * @return array Jalali metadata (date, weekday, day_number, month_name, year)
	 */
	public static function generate_jalali_metadata( $gregorian_date ) {
		$metadata = array(
			'date'        => '',
			'weekday'     => '',
			'day_number'  => '',
			'month_name'  => '',
			'year'        => '',
		);

		if ( function_exists( 'parsidate' ) ) {
			$metadata['date']       = self::convert_persian_digits_to_english( parsidate( 'Y/m/d', $gregorian_date ) );
			$metadata['weekday']    = parsidate( 'l', $gregorian_date );
			$metadata['day_number'] = self::convert_persian_digits_to_english( parsidate( 'j', $gregorian_date ) );
			$metadata['month_name'] = parsidate( 'F', $gregorian_date );
			$metadata['year']       = self::convert_persian_digits_to_english( parsidate( 'Y', $gregorian_date ) );
		}

		return $metadata;
	}

	/**
	 * Convert time string (HH:MM or HH:MM:SS) to minutes
	 *
	 * @param string $time Time in HH:MM or HH:MM:SS format
	 * @return int Total minutes
	 */
	public static function time_to_minutes( $time ) {
		$parts = explode( ':', $time );
		$hours = intval( $parts[0] );
		$minutes = intval( $parts[1] ?? 0 );

		return ( $hours * 60 ) + $minutes;
	}

	/**
	 * Convert minutes to time string (HH:MM)
	 *
	 * @param int $minutes Total minutes
	 * @return string Time in HH:MM format
	 */
	public static function minutes_to_time( $minutes ) {
		$hours = floor( $minutes / 60 );
		$mins = $minutes % 60;

		return sprintf( '%02d:%02d', $hours, $mins );
	}

	/**
	 * Add seconds to time if not present (HH:MM -> HH:MM:SS)
	 *
	 * @param string $time Time in HH:MM or HH:MM:SS format
	 * @return string Time in HH:MM:SS format
	 */
	public static function normalize_time_format( $time ) {
		if ( substr_count( $time, ':' ) === 1 ) {
			return $time . ':00';
		}
		return $time;
	}

	/**
	 * Remove seconds from time if present (HH:MM:SS -> HH:MM)
	 *
	 * @param string $time Time in HH:MM or HH:MM:SS format
	 * @return string Time in HH:MM format
	 */
	public static function strip_seconds( $time ) {
		$parts = explode( ':', $time );
		return sprintf( '%s:%s', $parts[0], $parts[1] ?? '00' );
	}

	/**
	 * Check if two time ranges overlap
	 *
	 * @param string $start1 Start time of first range
	 * @param string $end1 End time of first range
	 * @param string $start2 Start time of second range
	 * @param string $end2 End time of second range
	 * @return bool True if ranges overlap
	 */
	public static function time_ranges_overlap( $start1, $end1, $start2, $end2 ) {
		$start1_mins = self::time_to_minutes( $start1 );
		$end1_mins   = self::time_to_minutes( $end1 );
		$start2_mins = self::time_to_minutes( $start2 );
		$end2_mins   = self::time_to_minutes( $end2 );

		return $start1_mins < $end2_mins && $end1_mins > $start2_mins;
	}

	/**
	 * Get day of week abbreviation from full day name or date
	 *
	 * @param string $day Day name (e.g., 'Monday') or date
	 * @return string Three-letter lowercase day abbreviation (e.g., 'mon')
	 */
	public static function get_day_abbreviation( $day ) {
		$day_map = array(
			'saturday'  => 'sat',
			'sunday'    => 'sun',
			'monday'    => 'mon',
			'tuesday'   => 'tue',
			'wednesday' => 'wed',
			'thursday'  => 'thu',
			'friday'    => 'fri',
		);

		$day_lower = strtolower( trim( $day ) );

		// Check if it's already an abbreviation
		if ( in_array( $day_lower, array_values( $day_map ), true ) ) {
			return $day_lower;
		}

		// Try to match full name
		if ( isset( $day_map[ $day_lower ] ) ) {
			return $day_map[ $day_lower ];
		}

		// Try to extract from first 3 characters
		$abbrev = substr( $day_lower, 0, 3 );
		if ( in_array( $abbrev, array_values( $day_map ), true ) ) {
			return $abbrev;
		}

		return $day_lower;
	}

	/**
	 * Get Persian weekday name from English day abbreviation
	 *
	 * @param string $day_abbrev Day abbreviation (e.g., 'mon', 'tue')
	 * @return string Persian weekday name
	 */
	public static function get_persian_weekday( $day_abbrev ) {
		$persian_days = array(
			'sat' => 'شنبه',
			'sun' => 'یکشنبه',
			'mon' => 'دوشنبه',
			'tue' => 'سه‌شنبه',
			'wed' => 'چهارشنبه',
			'thu' => 'پنج‌شنبه',
			'fri' => 'جمعه',
		);

		return $persian_days[ $day_abbrev ] ?? '';
	}

	/**
	 * Get Persian month names array
	 *
	 * @return array Month number => Persian name
	 */
	public static function get_persian_months() {
		return array(
			1  => 'فروردین',
			2  => 'اردیبهشت',
			3  => 'خرداد',
			4  => 'تیر',
			5  => 'مرداد',
			6  => 'شهریور',
			7  => 'مهر',
			8  => 'آبان',
			9  => 'آذر',
			10 => 'دی',
			11 => 'بهمن',
			12 => 'اسفند',
		);
	}
}

