<?php
/**
 * Working Hours Repository
 * 
 * Handles database operations for schedule working hours
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Repositories;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Working Hours Repository class
 */
class WorkingHoursRepository extends BaseRepository {
	
	/**
	 * Table name
	 * 
	 * @var string
	 */
	protected $table = 'nobat_working_hours';
	
	/**
	 * Find working hours by schedule ID
	 * 
	 * @param int $schedule_id
	 * @return array
	 */
	public function find_by_schedule( $schedule_id ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} 
				WHERE schedule_id = %d 
				ORDER BY FIELD(day_of_week, 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'), start_time ASC",
				$schedule_id
			),
			ARRAY_A
		);
	}
	
	/**
	 * Find working hours by schedule ID and day
	 * 
	 * @param int $schedule_id
	 * @param string $day_of_week
	 * @return array
	 */
	public function find_by_schedule_and_day( $schedule_id, $day_of_week ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} 
				WHERE schedule_id = %d AND day_of_week = %s 
				ORDER BY start_time ASC",
				$schedule_id,
				$day_of_week
			),
			ARRAY_A
		);
	}
	
	/**
	 * Delete all working hours for a schedule
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
	 * Insert multiple working hours
	 * 
	 * @param array $working_hours Array of working hour records
	 * @return bool
	 */
	public function insert_multiple( $working_hours ) {
		if ( empty( $working_hours ) ) {
			return true;
		}
		
		$this->begin_transaction();
		
		try {
			foreach ( $working_hours as $hour ) {
				$result = $this->insert( $hour );
				
				if ( ! $result ) {
					throw new \Exception( 'Failed to insert working hour' );
				}
			}
			
			$this->commit();
			return true;
			
		} catch ( Exception $e ) {
			$this->rollback();
			error_log( 'Failed to insert multiple working hours: ' . $e->getMessage() );
			return false;
		}
	}
	
	/**
	 * Replace working hours for a schedule
	 * 
	 * @param int $schedule_id
	 * @param array $working_hours
	 * @return bool
	 */
	public function replace_for_schedule( $schedule_id, $working_hours ) {
		$this->begin_transaction();
		
		try {
			// Delete existing working hours
			$this->delete_by_schedule( $schedule_id );
			
			// Insert new working hours
			if ( ! empty( $working_hours ) ) {
				foreach ( $working_hours as &$hour ) {
					$hour['schedule_id'] = $schedule_id;
				}
				
				if ( ! $this->insert_multiple( $working_hours ) ) {
					throw new \Exception( 'Failed to insert new working hours' );
				}
			}
			
			$this->commit();
			return true;
			
		} catch ( Exception $e ) {
			$this->rollback();
			error_log( 'Failed to replace working hours: ' . $e->getMessage() );
			return false;
		}
	}
	
	/**
	 * Get working hours grouped by day
	 * 
	 * @param int $schedule_id
	 * @return array Associative array with days as keys
	 */
	public function get_grouped_by_day( $schedule_id ) {
		$hours = $this->find_by_schedule( $schedule_id );
		$grouped = array();
		
		foreach ( $hours as $hour ) {
			$day = $hour['day_of_week'];
			
			if ( ! isset( $grouped[ $day ] ) ) {
				$grouped[ $day ] = array();
			}
			
			$grouped[ $day ][] = $hour;
		}
		
		return $grouped;
	}
	
	/**
	 * Check if working hours exist for a specific schedule
	 * 
	 * @param int $schedule_id
	 * @return bool
	 */
	public function exists_for_schedule( $schedule_id ) {
		$count = $this->wpdb->get_var(
			$this->wpdb->prepare(
				"SELECT COUNT(*) FROM {$this->table_name} WHERE schedule_id = %d",
				$schedule_id
			)
		);
		
		return $count > 0;
	}
}

