<?php
/**
 * Slot Generator Utility
 *
 * Handles generation of appointment slots from working hours
 *
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Slot Generator class
 */
class SlotGenerator {

	/**
	 * Generate slots from working hours for a date range
	 *
	 * @param int $schedule_id Schedule ID
	 * @param array $working_hours Array of working hours
	 * @param string $start_date Start date (Y-m-d)
	 * @param string $end_date End date (Y-m-d)
	 * @param int $meeting_duration Duration in minutes
	 * @param int $buffer_time Buffer time in minutes
	 * @return array Array of slot data ready for insertion
	 */
	public static function generate_slots_from_working_hours( $schedule_id, $working_hours, $start_date, $end_date, $meeting_duration, $buffer_time = 0 ) {
		$slots = array();

		// Group working hours by day of week
		$hours_by_day = self::group_working_hours_by_day( $working_hours );

		// Iterate through each date in the range
		$current_date = new \DateTime( $start_date );
		$end_date_obj = new \DateTime( $end_date );

		while ( $current_date <= $end_date_obj ) {
			$gregorian_date = $current_date->format( 'Y-m-d' );
			
			// Get day of week abbreviation (lowercase)
			$day_of_week = strtolower( $current_date->format( 'D' ) ); // Mon -> mon

			// Generate slots for this day if working hours exist
			if ( isset( $hours_by_day[ $day_of_week ] ) ) {
				foreach ( $hours_by_day[ $day_of_week ] as $period ) {
					$day_slots = self::generate_slots_for_period(
						$period['start_time'],
						$period['end_time'],
						$meeting_duration,
						$buffer_time
					);

					foreach ( $day_slots as $slot ) {
						$slots[] = array(
							'schedule_id' => $schedule_id,
							'slot_date'   => $gregorian_date,
							'start_time'  => $slot['start'],
							'end_time'    => $slot['end'],
							'status'      => 'available',
						);
					}
				}
			}

			$current_date->modify( '+1 day' );
		}

		return $slots;
	}

	/**
	 * Generate slots for a specific time period
	 *
	 * @param string $start_time Start time (HH:MM or HH:MM:SS)
	 * @param string $end_time End time (HH:MM or HH:MM:SS)
	 * @param int $meeting_duration Duration in minutes
	 * @param int $buffer_time Buffer time in minutes
	 * @return array Array of slots with start and end times
	 */
	public static function generate_slots_for_period( $start_time, $end_time, $meeting_duration, $buffer_time = 0 ) {
		$slots = array();

		$start_timestamp = strtotime( $start_time );
		$end_timestamp   = strtotime( $end_time );

		$current = $start_timestamp;

		while ( $current + ( $meeting_duration * 60 ) <= $end_timestamp ) {
			$slot_end = $current + ( $meeting_duration * 60 );

			$slots[] = array(
				'start' => date( 'H:i:s', $current ),
				'end'   => date( 'H:i:s', $slot_end ),
			);

			$current = $slot_end + ( $buffer_time * 60 );
		}

		return $slots;
	}

	/**
	 * Group working hours by day of week
	 *
	 * @param array $working_hours Array of working hours
	 * @return array Grouped by day_of_week
	 */
	private static function group_working_hours_by_day( $working_hours ) {
		$grouped = array();

		foreach ( $working_hours as $hour ) {
			$day = strtolower( $hour['day_of_week'] );

			if ( ! isset( $grouped[ $day ] ) ) {
				$grouped[ $day ] = array();
			}

			$grouped[ $day ][] = $hour;
		}

		return $grouped;
	}

	/**
	 * Generate slots for a single day
	 *
	 * @param string $date Date (Y-m-d)
	 * @param array $working_hours Working hours for this day's day_of_week
	 * @param int $meeting_duration Duration in minutes
	 * @param int $buffer_time Buffer time in minutes
	 * @return array Array of slots for this day
	 */
	public static function generate_slots_for_day( $date, $working_hours, $meeting_duration, $buffer_time = 0 ) {
		$slots = array();

		foreach ( $working_hours as $period ) {
			$period_slots = self::generate_slots_for_period(
				$period['start_time'],
				$period['end_time'],
				$meeting_duration,
				$buffer_time
			);

			foreach ( $period_slots as $slot ) {
				$slots[] = array(
					'slot_date'  => $date,
					'start_time' => $slot['start'],
					'end_time'   => $slot['end'],
					'status'     => 'available',
				);
			}
		}

		return $slots;
	}

	/**
	 * Calculate total slots count for a period
	 *
	 * @param string $start_time Start time
	 * @param string $end_time End time
	 * @param int $meeting_duration Duration in minutes
	 * @param int $buffer_time Buffer time in minutes
	 * @return int Number of slots
	 */
	public static function count_slots_in_period( $start_time, $end_time, $meeting_duration, $buffer_time = 0 ) {
		$start_mins = DateTimeHelper::time_to_minutes( $start_time );
		$end_mins   = DateTimeHelper::time_to_minutes( $end_time );

		$total_mins = $end_mins - $start_mins;
		$slot_duration = $meeting_duration + $buffer_time;

		if ( $slot_duration <= 0 ) {
			return 0;
		}

		return floor( $total_mins / $slot_duration );
	}

	/**
	 * Validate slot doesn't overlap with existing slots
	 *
	 * @param string $start_time Slot start time
	 * @param string $end_time Slot end time
	 * @param array $existing_slots Array of existing slots for the same date
	 * @return bool True if no overlap
	 */
	public static function validate_no_overlap( $start_time, $end_time, $existing_slots ) {
		foreach ( $existing_slots as $slot ) {
			if ( DateTimeHelper::time_ranges_overlap(
				$start_time,
				$end_time,
				$slot['start_time'],
				$slot['end_time']
			) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Generate time slots from legacy settings (for backward compatibility)
	 *
	 * @param bool $include_breaks If true, includes slots within breaks
	 * @return array List of slot strings like "09:00-10:00"
	 */
	public static function generate_slots_from_settings( $include_breaks = false ) {
		$interval = (int) get_option( 'appointment_booking_slot_interval', 60 );
		$start = (string) get_option( 'appointment_booking_day_start', '09:00' );
		$end = (string) get_option( 'appointment_booking_day_end', '17:00' );
		$breaks_raw = (string) get_option( 'appointment_booking_breaks', '12:00-14:00' );

		$break_ranges = array();
		foreach ( preg_split( '/\r\n|\r|\n/', $breaks_raw ) as $line ) {
			$line = trim( $line );
			if ( $line === '' ) {
				continue;
			}
			list( $b_start, $b_end ) = array_map( 'trim', explode( '-', $line ) );
			$break_ranges[] = array( $b_start, $b_end );
		}

		$slots = array();
		$cursor = DateTimeHelper::time_to_minutes( $start );
		$end_minutes = DateTimeHelper::time_to_minutes( $end );

		while ( $cursor + $interval <= $end_minutes ) {
			$slot_start = $cursor;
			$slot_end = $cursor + $interval;
			$label = DateTimeHelper::minutes_to_time( $slot_start ) . '-' . DateTimeHelper::minutes_to_time( $slot_end );

			$in_break = false;
			foreach ( $break_ranges as $br ) {
				list( $bs, $be ) = $br;
				$bs_m = DateTimeHelper::time_to_minutes( $bs );
				$be_m = DateTimeHelper::time_to_minutes( $be );
				if ( $slot_start < $be_m && $slot_end > $bs_m ) {
					$in_break = true;
					break;
				}
			}

			if ( $include_breaks || ! $in_break ) {
				$slots[] = $label;
			}

			$cursor += $interval;
		}

		return $slots;
	}
}

