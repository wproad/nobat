<?php
/**
 * Appointment History Repository
 * 
 * Handles database operations for appointment history (audit trail)
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Repositories;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Appointment History Repository class
 */
class AppointmentHistoryRepository extends BaseRepository {
	
	/**
	 * Table name
	 * 
	 * @var string
	 */
	protected $table = 'nobat_history';
	
	/**
	 * Table does not have updated_at
	 * 
	 * @return bool
	 */
	protected function has_timestamps() {
		return false;
	}
	
	/**
	 * Add history entry
	 * 
	 * @param int $appointment_id
	 * @param int $user_id
	 * @param string $action
	 * @param string|null $notes
	 * @return int|false
	 */
	public function add_entry( $appointment_id, $user_id, $action, $notes = null ) {
		return $this->insert( array(
			'appointment_id' => $appointment_id,
			'user_id' => $user_id,
			'action' => $action,
			'notes' => $notes
		) );
	}
	
	/**
	 * Find history by appointment ID
	 * 
	 * @param int $appointment_id
	 * @return array
	 */
	public function find_by_appointment( $appointment_id ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT h.*, u.display_name as user_name, u.user_email
				FROM {$this->table_name} h
				LEFT JOIN {$this->wpdb->prefix}users u ON h.user_id = u.ID
				WHERE h.appointment_id = %d
				ORDER BY h.created_at ASC",
				$appointment_id
			),
			ARRAY_A
		);
	}
	
	/**
	 * Find history by user ID
	 * 
	 * @param int $user_id
	 * @param int $limit
	 * @return array
	 */
	public function find_by_user( $user_id, $limit = null ) {
		$query = $this->wpdb->prepare(
			"SELECT h.*, a.id as appointment_id
			FROM {$this->table_name} h
			LEFT JOIN {$this->wpdb->prefix}appointments a ON h.appointment_id = a.id
			WHERE h.user_id = %d
			ORDER BY h.created_at DESC",
			$user_id
		);
		
		if ( $limit ) {
			$query .= $this->wpdb->prepare( " LIMIT %d", $limit );
		}
		
		return $this->wpdb->get_results( $query, ARRAY_A );
	}
	
	/**
	 * Get recent history entries
	 * 
	 * @param int $limit
	 * @return array
	 */
	public function get_recent( $limit = 50 ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT h.*, 
				u.display_name as user_name,
				a.id as appointment_id
				FROM {$this->table_name} h
				LEFT JOIN {$this->wpdb->prefix}users u ON h.user_id = u.ID
				LEFT JOIN {$this->wpdb->prefix}appointments a ON h.appointment_id = a.id
				ORDER BY h.created_at DESC
				LIMIT %d",
				$limit
			),
			ARRAY_A
		);
	}
	
	/**
	 * Count history entries by action
	 * 
	 * @param string $action
	 * @param string|null $date_from
	 * @param string|null $date_to
	 * @return int
	 */
	public function count_by_action( $action, $date_from = null, $date_to = null ) {
		$query = $this->wpdb->prepare(
			"SELECT COUNT(*) FROM {$this->table_name} WHERE action = %s",
			$action
		);
		
		if ( $date_from ) {
			$query .= $this->wpdb->prepare( " AND created_at >= %s", $date_from );
		}
		
		if ( $date_to ) {
			$query .= $this->wpdb->prepare( " AND created_at <= %s", $date_to );
		}
		
		return (int) $this->wpdb->get_var( $query );
	}
	
	/**
	 * Get activity summary for a date range
	 * 
	 * @param string $date_from
	 * @param string $date_to
	 * @return array
	 */
	public function get_activity_summary( $date_from, $date_to ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT action, COUNT(*) as count
				FROM {$this->table_name}
				WHERE created_at >= %s AND created_at <= %s
				GROUP BY action
				ORDER BY count DESC",
				$date_from,
				$date_to
			),
			ARRAY_A
		);
	}
}

