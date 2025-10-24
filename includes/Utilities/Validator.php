<?php
/**
 * Validation Utility Helper
 *
 * Handles validation and sanitization of inputs
 *
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Validator Helper class
 */
class Validator {

	/**
	 * Validate time in HH:MM or HH:MM:SS format (24-hour)
	 *
	 * @param string $time Time string to validate
	 * @return bool True if valid
	 */
	public static function validate_time( $time ) {
		// Match HH:MM or HH:MM:SS (24-hour format)
		return (bool) preg_match( '/^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/', $time );
	}

	/**
	 * Validate date in Y-m-d format
	 *
	 * @param string $date Date string to validate
	 * @return bool True if valid
	 */
	public static function validate_date( $date ) {
		$d = DateTime::createFromFormat( 'Y-m-d', $date );
		return $d && $d->format( 'Y-m-d' ) === $date;
	}

	/**
	 * Validate Jalali date in YYYY/MM/DD or YYYY-MM-DD format
	 *
	 * @param string $date Jalali date string
	 * @return bool True if format is valid (not checking actual calendar validity)
	 */
	public static function validate_jalali_date( $date ) {
		// Match YYYY/MM/DD or YYYY-MM-DD
		return (bool) preg_match( '/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/', $date );
	}

	/**
	 * Validate status against allowed values
	 *
	 * @param string $status Status to validate
	 * @param array $allowed Array of allowed status values
	 * @return bool True if status is in allowed values
	 */
	public static function validate_status( $status, $allowed ) {
		return in_array( $status, $allowed, true );
	}

	/**
	 * Validate appointment status
	 *
	 * @param string $status Status to validate
	 * @return bool True if valid appointment status
	 */
	public static function validate_appointment_status( $status ) {
		$allowed = array( 'pending', 'confirmed', 'completed', 'cancelled', 'cancel_requested' );
		return self::validate_status( $status, $allowed );
	}

	/**
	 * Validate slot status
	 *
	 * @param string $status Status to validate
	 * @return bool True if valid slot status
	 */
	public static function validate_slot_status( $status ) {
		$allowed = array( 'available', 'booked', 'blocked' );
		return self::validate_status( $status, $allowed );
	}

	/**
	 * Validate day of week abbreviation
	 *
	 * @param string $day Day abbreviation
	 * @return bool True if valid
	 */
	public static function validate_day_of_week( $day ) {
		$allowed = array( 'sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri' );
		return in_array( strtolower( $day ), $allowed, true );
	}

	/**
	 * Validate positive integer
	 *
	 * @param mixed $value Value to validate
	 * @return bool True if valid positive integer
	 */
	public static function validate_positive_integer( $value ) {
		return is_numeric( $value ) && intval( $value ) > 0 && intval( $value ) == $value;
	}

	/**
	 * Validate non-negative integer (0 or positive)
	 *
	 * @param mixed $value Value to validate
	 * @return bool True if valid non-negative integer
	 */
	public static function validate_non_negative_integer( $value ) {
		return is_numeric( $value ) && intval( $value ) >= 0 && intval( $value ) == $value;
	}

	/**
	 * Sanitize time in HH:MM format
	 *
	 * @param string $time Time string
	 * @return string Sanitized time or default (09:00)
	 */
	public static function sanitize_time( $time ) {
		if ( self::validate_time( $time ) ) {
			// Strip seconds if present
			require_once plugin_dir_path( __FILE__ ) . 'DateTimeHelper.php';
			return Appointment_Booking_DateTime_Helper::strip_seconds( $time );
		}
		return '09:00';
	}

	/**
	 * Sanitize and validate date
	 *
	 * @param string $date Date string
	 * @return string|false Sanitized date or false if invalid
	 */
	public static function sanitize_date( $date ) {
		if ( self::validate_date( $date ) ) {
			return $date;
		}
		return false;
	}

	/**
	 * Sanitize status value
	 *
	 * @param string $status Status string
	 * @param array $allowed Array of allowed values
	 * @param string $default Default value if invalid
	 * @return string Sanitized status
	 */
	public static function sanitize_status( $status, $allowed, $default ) {
		if ( self::validate_status( $status, $allowed ) ) {
			return $status;
		}
		return $default;
	}

	/**
	 * Validate email address
	 *
	 * @param string $email Email to validate
	 * @return bool True if valid
	 */
	public static function validate_email( $email ) {
		return is_email( $email );
	}

	/**
	 * Validate phone number (basic validation)
	 *
	 * @param string $phone Phone number
	 * @return bool True if appears to be a valid phone number
	 */
	public static function validate_phone( $phone ) {
		// Basic validation: at least 10 digits
		$digits_only = preg_replace( '/\D/', '', $phone );
		return strlen( $digits_only ) >= 10;
	}

	/**
	 * Validate array of working hours
	 *
	 * @param array $working_hours Working hours array
	 * @return bool True if valid structure
	 */
	public static function validate_working_hours( $working_hours ) {
		if ( ! is_array( $working_hours ) || empty( $working_hours ) ) {
			return false;
		}

		foreach ( $working_hours as $hour ) {
			if ( ! is_array( $hour ) ) {
				return false;
			}

			// Required fields
			if ( ! isset( $hour['day_of_week'] ) || ! isset( $hour['start_time'] ) || ! isset( $hour['end_time'] ) ) {
				return false;
			}

			// Validate day of week
			if ( ! self::validate_day_of_week( $hour['day_of_week'] ) ) {
				return false;
			}

			// Validate times
			if ( ! self::validate_time( $hour['start_time'] ) || ! self::validate_time( $hour['end_time'] ) ) {
				return false;
			}

			// End time should be after start time
			require_once plugin_dir_path( __FILE__ ) . 'DateTimeHelper.php';
			$start_mins = Appointment_Booking_DateTime_Helper::time_to_minutes( $hour['start_time'] );
			$end_mins = Appointment_Booking_DateTime_Helper::time_to_minutes( $hour['end_time'] );

			if ( $end_mins <= $start_mins ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Validate user ID exists in WordPress
	 *
	 * @param int $user_id User ID
	 * @return bool True if user exists
	 */
	public static function validate_user_id( $user_id ) {
		if ( ! self::validate_positive_integer( $user_id ) ) {
			return false;
		}

		$user = get_user_by( 'id', $user_id );
		return $user !== false;
	}

	/**
	 * Validate that a date is in the future
	 *
	 * @param string $date Date in Y-m-d format
	 * @return bool True if date is in the future
	 */
	public static function is_future_date( $date ) {
		if ( ! self::validate_date( $date ) ) {
			return false;
		}

		$date_obj = new \DateTime( $date );
		$now = new \DateTime( 'today' );

		return $date_obj >= $now;
	}

	/**
	 * Validate that a date is within a range
	 *
	 * @param string $date Date to check
	 * @param string $start_date Range start
	 * @param string $end_date Range end
	 * @return bool True if date is within range (inclusive)
	 */
	public static function is_date_in_range( $date, $start_date, $end_date ) {
		if ( ! self::validate_date( $date ) || ! self::validate_date( $start_date ) || ! self::validate_date( $end_date ) ) {
			return false;
		}

		$date_obj = new \DateTime( $date );
		$start_obj = new \DateTime( $start_date );
		$end_obj = new \DateTime( $end_date );

		return $date_obj >= $start_obj && $date_obj <= $end_obj;
	}
}

