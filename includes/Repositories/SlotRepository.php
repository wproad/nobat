<?php
/**
 * Slot Repository
 * 
 * Handles database operations for appointment slots
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Repositories;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Slot Repository class
 */
class SlotRepository extends BaseRepository {
	
	/**
	 * Table name
	 * 
	 * @var string
	 */
	protected $table = 'nobat_slots';
	
	/**
	 * Find slots by schedule ID
	 * 
	 * @param int $schedule_id
	 * @param array $args Additional arguments
	 * @return array
	 */
	public function find_by_schedule( $schedule_id, $args = array() ) {
		$defaults = array(
			'status' => null,
			'date_from' => null,
			'date_to' => null,
			'limit' => null
		);
		
		$args = wp_parse_args( $args, $defaults );
		
		$query = $this->wpdb->prepare(
			"SELECT * FROM {$this->table_name} WHERE schedule_id = %d",
			$schedule_id
		);
		
		if ( $args['status'] ) {
			$query .= $this->wpdb->prepare( " AND status = %s", $args['status'] );
		}
		
		if ( $args['date_from'] ) {
			$query .= $this->wpdb->prepare( " AND slot_date >= %s", $args['date_from'] );
		}
		
		if ( $args['date_to'] ) {
			$query .= $this->wpdb->prepare( " AND slot_date <= %s", $args['date_to'] );
		}
		
		$query .= " ORDER BY slot_date ASC, start_time ASC";
		
		if ( $args['limit'] ) {
			$query .= $this->wpdb->prepare( " LIMIT %d", $args['limit'] );
		}
		
		return $this->wpdb->get_results( $query, ARRAY_A );
	}
	
	/**
	 * Find slots by date
	 * 
	 * @param int $schedule_id
	 * @param string $date
	 * @return array
	 */
	public function find_by_date( $schedule_id, $date ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} 
				WHERE schedule_id = %d AND slot_date = %s 
				ORDER BY start_time ASC",
				$schedule_id,
				$date
			),
			ARRAY_A
		);
	}
	
	/**
	 * Find available slots
	 * 
	 * @param int $schedule_id
	 * @param string $date_from
	 * @param string $date_to
	 * @param int $limit
	 * @return array
	 */
	public function find_available( $schedule_id, $date_from = null, $date_to = null, $limit = null ) {
		$query = $this->wpdb->prepare(
			"SELECT * FROM {$this->table_name} 
			WHERE schedule_id = %d AND status = 'available'",
			$schedule_id
		);
		
		if ( $date_from ) {
			$query .= $this->wpdb->prepare( " AND slot_date >= %s", $date_from );
		}
		
		if ( $date_to ) {
			$query .= $this->wpdb->prepare( " AND slot_date <= %s", $date_to );
		}
		
		$query .= " ORDER BY slot_date ASC, start_time ASC";
		
		if ( $limit ) {
			$query .= $this->wpdb->prepare( " LIMIT %d", $limit );
		}
		
		return $this->wpdb->get_results( $query, ARRAY_A );
	}
	
	/**
	 * Find a specific slot
	 * 
	 * @param int $schedule_id
	 * @param string $date
	 * @param string $start_time
	 * @return array|null
	 */
	public function find_slot( $schedule_id, $date, $start_time ) {
		$result = $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} 
				WHERE schedule_id = %d AND slot_date = %s AND start_time = %s",
				$schedule_id,
				$date,
				$start_time
			),
			ARRAY_A
		);
		
		return $result ?: null;
	}
	
	/**
	 * Check if a slot is available
	 * 
	 * @param int $slot_id
	 * @return bool
	 */
	public function is_available( $slot_id ) {
		$status = $this->wpdb->get_var(
			$this->wpdb->prepare(
				"SELECT status FROM {$this->table_name} WHERE id = %d",
				$slot_id
			)
		);
		
		return $status === 'available';
	}
	
	/**
	 * Get slot status
	 * 
	 * @param int $slot_id
	 * @return string|null
	 */
	public function get_status( $slot_id ) {
		$slot = $this->find( $slot_id );
		return $slot ? $slot['status'] : null;
	}
	
	/**
	 * Update slot status
	 * 
	 * @param int $slot_id
	 * @param string $status
	 * @return bool
	 */
	public function update_status( $slot_id, $status ) {
		return $this->update( $slot_id, array( 'status' => $status ) );
	}
	
	/**
	 * Mark slot as booked
	 * 
	 * @param int $slot_id
	 * @return bool
	 */
	public function mark_as_booked( $slot_id ) {
		return $this->update_status( $slot_id, 'booked' );
	}
	
	/**
	 * Mark slot as available
	 * 
	 * @param int $slot_id
	 * @return bool
	 */
	public function mark_as_available( $slot_id ) {
		$result = $this->update_status( $slot_id, 'available' );
		error_log( sprintf( 
			'[Nobat] Slot #%d mark_as_available called. Result: %s. New status in DB: %s', 
			$slot_id,
			$result ? 'SUCCESS' : 'FAILED',
			$this->get_status( $slot_id )
		) );
		return $result;
	}
	
	/**
	 * Mark slot as blocked
	 * 
	 * @param int $slot_id
	 * @return bool
	 */
	public function mark_as_blocked( $slot_id ) {
		return $this->update_status( $slot_id, 'blocked' );
	}
	
	/**
	 * Delete slots by schedule
	 * 
	 * @param int $schedule_id
	 * @return bool
	 */
	public function delete_by_schedule( $schedule_id ) {
		$result = $this->wpdb->delete(
			$this->table_name,
			array( 'schedule_id' => $schedule_id ),
			array( '%d' )
		);
		
		return $result !== false;
	}
	
	/**
	 * Insert multiple slots
	 * 
	 * @param array $slots
	 * @return bool
	 */
	public function insert_multiple( $slots ) {
		if ( empty( $slots ) ) {
			return true;
		}
		
		$this->begin_transaction();
		
		try {
			foreach ( $slots as $slot ) {
				$result = $this->insert( $slot );
				
				if ( ! $result ) {
					throw new \Exception( 'Failed to insert slot' );
				}
			}
			
			$this->commit();
			return true;
			
		} catch ( Exception $e ) {
			$this->rollback();
			error_log( 'Failed to insert multiple slots: ' . $e->getMessage() );
			return false;
		}
	}
	
	/**
	 * Get slots grouped by date
	 * 
	 * @param int $schedule_id
	 * @param string $date_from
	 * @param string $date_to
	 * @return array Associative array with dates as keys
	 */
	public function get_grouped_by_date( $schedule_id, $date_from = null, $date_to = null ) {
		$slots = $this->find_by_schedule( $schedule_id, array(
			'date_from' => $date_from,
			'date_to' => $date_to
		) );
		
		$grouped = array();
		
		foreach ( $slots as $slot ) {
			$date = $slot['slot_date'];
			
			if ( ! isset( $grouped[ $date ] ) ) {
				// Convert Gregorian to Jalali for display
				$jalali_date = \Nobat\Utilities\DateTimeHelper::gregorian_to_jalali( $date );
				$jalali_parts = explode( '/', $jalali_date ); // Format: YYYY/MM/DD
				
				// Get Persian weekday name
				$timestamp = strtotime( $date );
				$weekday_num = date( 'w', $timestamp ); // 0 (Sunday) through 6 (Saturday)
				$weekday_persian = array( 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه' );
				
				// Get Persian month name
				$month_num = (int) $jalali_parts[1];
				$month_names = array(
					1 => 'فروردین', 2 => 'اردیبهشت', 3 => 'خرداد',
					4 => 'تیر', 5 => 'مرداد', 6 => 'شهریور',
					7 => 'مهر', 8 => 'آبان', 9 => 'آذر',
					10 => 'دی', 11 => 'بهمن', 12 => 'اسفند'
				);
				
				$grouped[ $date ] = array(
					'date' => $date, // Gregorian date
					'jalali_date' => $jalali_date, // Converted on-the-fly
					'weekday' => $weekday_persian[ $weekday_num ],
					'day_number' => $jalali_parts[2],
					'month_name' => $month_names[ $month_num ],
					'slots' => array()
				);
			}
			
			$grouped[ $date ]['slots'][] = $slot;
		}
		
		return array_values( $grouped );
	}
	
	/**
	 * Count available slots for a date range
	 * 
	 * @param int $schedule_id
	 * @param string $date_from
	 * @param string $date_to
	 * @return int
	 */
	public function count_available( $schedule_id, $date_from = null, $date_to = null ) {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table_name} 
			WHERE schedule_id = %d AND status = 'available'",
			$schedule_id
		);
		
		if ( $date_from ) {
			$query .= $this->wpdb->prepare( " AND slot_date >= %s", $date_from );
		}
		
		if ( $date_to ) {
			$query .= $this->wpdb->prepare( " AND slot_date <= %s", $date_to );
		}
		
		return (int) $this->wpdb->get_var( $query );
	}
}

