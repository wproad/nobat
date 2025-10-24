<?php
/**
 * Schedule Repository
 * 
 * Handles database operations for schedules
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Repositories;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Schedule Repository class
 */
class ScheduleRepository extends BaseRepository {
	
	/**
	 * Table name
	 * 
	 * @var string
	 */
	protected $table = 'nobat_schedules';
	
	/**
	 * Find the active schedule
	 * 
	 * @return array|null
	 */
	public function find_active() {
		$result = $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} WHERE is_active = %d ORDER BY id DESC LIMIT 1",
				1
			),
			ARRAY_A
		);
		
		return $result ?: null;
	}
	
	/**
	 * Find schedules by date range
	 * 
	 * @param string $start_date
	 * @param string $end_date
	 * @return array
	 */
	public function find_by_date_range( $start_date, $end_date ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} 
				WHERE start_date <= %s AND end_date >= %s 
				ORDER BY start_date ASC",
				$end_date,
				$start_date
			),
			ARRAY_A
		);
	}
	
	/**
	 * Find schedules that are currently active (within date range)
	 * 
	 * @return array
	 */
	public function find_current_schedules() {
		$today = current_time( 'Y-m-d' );
		
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} 
				WHERE is_active = %d 
				AND start_date <= %s 
				AND end_date >= %s 
				ORDER BY start_date ASC",
				1,
				$today,
				$today
			),
			ARRAY_A
		);
	}
	
	/**
	 * Deactivate all schedules
	 * 
	 * @return bool
	 */
	public function deactivate_all() {
		$result = $this->wpdb->update(
			$this->table_name,
			array( 'is_active' => 0 ),
			array( 'is_active' => 1 ),
			array( '%d' ),
			array( '%d' )
		);
		
		return $result !== false;
	}
	
	/**
	 * Activate a specific schedule (and deactivate others)
	 * 
	 * @param int $schedule_id
	 * @return bool
	 */
	public function activate( $schedule_id ) {
		$this->begin_transaction();
		
		try {
			// Deactivate all schedules
			$this->deactivate_all();
			
			// Activate the specified schedule
			$result = $this->update( $schedule_id, array( 'is_active' => 1 ) );
			
			if ( ! $result ) {
				throw new \Exception( 'Failed to activate schedule' );
			}
			
			$this->commit();
			return true;
			
		} catch ( Exception $e ) {
			$this->rollback();
			error_log( 'Failed to activate schedule: ' . $e->getMessage() );
			return false;
		}
	}
	
	/**
	 * Check if a schedule is active
	 * 
	 * @param int $schedule_id
	 * @return bool
	 */
	public function is_active( $schedule_id ) {
		$result = $this->wpdb->get_var(
			$this->wpdb->prepare(
				"SELECT is_active FROM {$this->table_name} WHERE id = %d",
				$schedule_id
			)
		);
		
		return (bool) $result;
	}
	
	/**
	 * Get schedule with working hours
	 * 
	 * @param int $schedule_id
	 * @return array|null
	 */
	public function get_with_working_hours( $schedule_id ) {
		$schedule = $this->find( $schedule_id );
		
		if ( ! $schedule ) {
			return null;
		}
		
		// Get working hours
		$working_hours = $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->wpdb->prefix}nobat_working_hours 
				WHERE schedule_id = %d 
				ORDER BY FIELD(day_of_week, 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')",
				$schedule_id
			),
			ARRAY_A
		);
		
		$schedule['working_hours'] = $working_hours;
		
		return $schedule;
	}
}

