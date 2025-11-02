<?php
/**
 * Appointment Repository
 * 
 * Handles database operations for appointments
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Repositories;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Appointment Repository class
 */
class AppointmentRepository extends BaseRepository {
	
	/**
	 * Table name
	 * 
	 * @var string
	 */
	protected $table = 'nobat_appointments';
	
	/**
	 * Find appointments by user ID
	 * 
	 * @param int $user_id
	 * @param array $args Additional arguments
	 * @return array
	 */
	public function find_by_user( $user_id, $args = array() ) {
		$defaults = array(
			'status' => null,
			'orderby' => 'created_at',
			'order' => 'DESC',
			'limit' => null
		);
		
		$args = wp_parse_args( $args, $defaults );
		
		$query = $this->wpdb->prepare(
			"SELECT a.*, s.slot_date, s.start_time, s.end_time
			FROM {$this->table_name} a
			LEFT JOIN {$this->wpdb->prefix}nobat_slots s ON a.slot_id = s.id
			WHERE a.user_id = %d",
			$user_id
		);
		
		if ( $args['status'] ) {
			if ( is_array( $args['status'] ) ) {
				$placeholders = implode( ', ', array_fill( 0, count( $args['status'] ), '%s' ) );
				$query .= $this->wpdb->prepare( " AND a.status IN ($placeholders)", $args['status'] );
			} else {
				$query .= $this->wpdb->prepare( " AND a.status = %s", $args['status'] );
			}
		}
		
		$query .= " ORDER BY a.{$args['orderby']} {$args['order']}";
		
		if ( $args['limit'] ) {
			$query .= $this->wpdb->prepare( " LIMIT %d", $args['limit'] );
		}
		
		$results = $this->wpdb->get_results( $query, ARRAY_A );
		
		// Add Jalali date to each appointment
		foreach ( $results as &$appointment ) {
			if ( ! empty( $appointment['slot_date'] ) ) {
				$jalali_date = \Nobat\Utilities\DateTimeHelper::gregorian_to_jalali( $appointment['slot_date'] );
				$appointment['slot_date_jalali'] = $jalali_date ? $jalali_date : $appointment['slot_date'];
			}
		}
		
		return $results;
	}
	
	/**
	 * Find appointments by schedule ID
	 * 
	 * @param int $schedule_id
	 * @param array $args Additional arguments
	 * @return array
	 */
	public function find_by_schedule( $schedule_id, $args = array() ) {
		$defaults = array(
			'status' => null,
			'orderby' => 'created_at',
			'order' => 'DESC'
		);
		
		$args = wp_parse_args( $args, $defaults );
		
		$query = $this->wpdb->prepare(
			"SELECT a.*, s.slot_date, s.start_time, s.end_time, 
			u.ID as user_id, u.display_name as user_name, u.user_email,
			COALESCE(um.meta_value, u.user_email) as user_phone,
			admin.display_name as admin_name
			FROM {$this->table_name} a
			LEFT JOIN {$this->wpdb->prefix}nobat_slots s ON a.slot_id = s.id
			LEFT JOIN {$this->wpdb->prefix}users u ON a.user_id = u.ID
			LEFT JOIN {$this->wpdb->prefix}usermeta um ON u.ID = um.user_id AND um.meta_key = 'phone'
			LEFT JOIN {$this->wpdb->prefix}users admin ON a.assigned_admin_id = admin.ID
			WHERE a.schedule_id = %d",
			$schedule_id
		);
		
		if ( $args['status'] ) {
			$query .= $this->wpdb->prepare( " AND a.status = %s", $args['status'] );
		}
		
		$query .= " ORDER BY a.{$args['orderby']} {$args['order']}";
		
		$results = $this->wpdb->get_results( $query, ARRAY_A );
		
		// Add Jalali date to each appointment
		foreach ( $results as &$appointment ) {
			if ( ! empty( $appointment['slot_date'] ) ) {
				$jalali_date = \Nobat\Utilities\DateTimeHelper::gregorian_to_jalali( $appointment['slot_date'] );
				$appointment['slot_date_jalali'] = $jalali_date ? $jalali_date : $appointment['slot_date'];
			}
		}
		
		return $results;
	}
	
	/**
	 * Find appointments by slot ID
	 * 
	 * @param int $slot_id
	 * @return array
	 */
	public function find_by_slot( $slot_id ) {
		return $this->wpdb->get_results(
			$this->wpdb->prepare(
				"SELECT a.*, u.display_name as user_name, u.user_email
				FROM {$this->table_name} a
				LEFT JOIN {$this->wpdb->prefix}users u ON a.user_id = u.ID
				WHERE a.slot_id = %d",
				$slot_id
			),
			ARRAY_A
		);
	}
	
	/**
	 * Count active appointments for a user
	 * 
	 * @param int $user_id
	 * @return int
	 */
	public function count_active_by_user( $user_id ) {
		return (int) $this->wpdb->get_var(
			$this->wpdb->prepare(
				"SELECT COUNT(*) FROM {$this->table_name} 
				WHERE user_id = %d AND status IN ('pending', 'confirmed')",
				$user_id
			)
		);
	}
	
	/**
	 * Find all appointments with full details
	 * 
	 * @param array $args Query arguments
	 * @return array
	 */
	public function find_all_with_details( $args = array() ) {
		$defaults = array(
			'status' => null,
			'date_from' => null,
			'date_to' => null,
			'schedule_id' => null,
			'assigned_admin_id' => null,
			'orderby' => 's.slot_date',
			'order' => 'DESC',
			'limit' => null,
			'offset' => 0
		);
		
		$args = wp_parse_args( $args, $defaults );
		
		$query = "SELECT a.*, 
			s.slot_date, s.start_time, s.end_time,
			u.ID as user_id, u.display_name as user_name, u.user_email,
			COALESCE(um.meta_value, u.user_email) as user_phone,
			admin.display_name as admin_name,
			sch.name as schedule_name
			FROM {$this->table_name} a
			LEFT JOIN {$this->wpdb->prefix}nobat_slots s ON a.slot_id = s.id
			LEFT JOIN {$this->wpdb->prefix}users u ON a.user_id = u.ID
			LEFT JOIN {$this->wpdb->prefix}usermeta um ON u.ID = um.user_id AND um.meta_key = 'phone'
			LEFT JOIN {$this->wpdb->prefix}users admin ON a.assigned_admin_id = admin.ID
			LEFT JOIN {$this->wpdb->prefix}nobat_schedules sch ON a.schedule_id = sch.id
			WHERE 1=1";
		
		if ( $args['status'] ) {
			if ( is_array( $args['status'] ) ) {
				$placeholders = implode( ', ', array_fill( 0, count( $args['status'] ), '%s' ) );
				$query .= $this->wpdb->prepare( " AND a.status IN ($placeholders)", $args['status'] );
			} else {
				$query .= $this->wpdb->prepare( " AND a.status = %s", $args['status'] );
			}
		}
		
		if ( $args['date_from'] ) {
			$query .= $this->wpdb->prepare( " AND s.slot_date >= %s", $args['date_from'] );
		}
		
		if ( $args['date_to'] ) {
			$query .= $this->wpdb->prepare( " AND s.slot_date <= %s", $args['date_to'] );
		}
		
		if ( $args['schedule_id'] ) {
			$query .= $this->wpdb->prepare( " AND a.schedule_id = %d", $args['schedule_id'] );
		}
		
		if ( $args['assigned_admin_id'] ) {
			$query .= $this->wpdb->prepare( " AND a.assigned_admin_id = %d", $args['assigned_admin_id'] );
		}
		
		$query .= " ORDER BY {$args['orderby']} {$args['order']}";
		
		if ( $args['limit'] ) {
			$query .= $this->wpdb->prepare( " LIMIT %d OFFSET %d", $args['limit'], $args['offset'] );
		}
		
		$results = $this->wpdb->get_results( $query, ARRAY_A );
		
		// Add Jalali date to each appointment
		foreach ( $results as &$appointment ) {
			if ( ! empty( $appointment['slot_date'] ) ) {
				$jalali_date = \Nobat\Utilities\DateTimeHelper::gregorian_to_jalali( $appointment['slot_date'] );
				$appointment['slot_date_jalali'] = $jalali_date ? $jalali_date : $appointment['slot_date'];
			}
		}
		
		return $results;
	}
	
	/**
	 * Find appointments pending cancellation
	 * 
	 * @return array
	 */
	public function find_cancellation_requests() {
		$results = $this->wpdb->get_results(
			"SELECT a.*, 
			s.slot_date, s.start_time, s.end_time,
			u.display_name as user_name, u.user_email,
			sch.name as schedule_name
			FROM {$this->table_name} a
			LEFT JOIN {$this->wpdb->prefix}nobat_slots s ON a.slot_id = s.id
			LEFT JOIN {$this->wpdb->prefix}users u ON a.user_id = u.ID
			LEFT JOIN {$this->wpdb->prefix}nobat_schedules sch ON a.schedule_id = sch.id
			WHERE a.status = 'cancel_requested'
			ORDER BY a.cancellation_requested_at ASC",
			ARRAY_A
		);
		
		// Add Jalali date to each appointment
		foreach ( $results as &$appointment ) {
			if ( ! empty( $appointment['slot_date'] ) ) {
				$jalali_date = \Nobat\Utilities\DateTimeHelper::gregorian_to_jalali( $appointment['slot_date'] );
				$appointment['slot_date_jalali'] = $jalali_date ? $jalali_date : $appointment['slot_date'];
			}
		}
		
		return $results;
	}
	
	/**
	 * Update appointment status with timestamp
	 * 
	 * @param int $appointment_id
	 * @param string $status
	 * @param int|null $admin_id
	 * @return bool
	 */
	public function update_status( $appointment_id, $status, $admin_id = null ) {
		$data = array( 'status' => $status );
		
		// Set appropriate timestamp based on status
		switch ( $status ) {
			case 'confirmed':
				$data['confirmed_at'] = current_time( 'mysql' );
				break;
			case 'completed':
				$data['completed_at'] = current_time( 'mysql' );
				if ( $admin_id ) {
					$data['assigned_admin_id'] = $admin_id;
				}
				break;
			case 'cancelled':
				$data['cancelled_at'] = current_time( 'mysql' );
				break;
			case 'cancel_requested':
				$data['cancellation_requested_at'] = current_time( 'mysql' );
				break;
		}
		
		return $this->update( $appointment_id, $data );
	}
	
	/**
	 * Get appointment with full details
	 * 
	 * @param int $appointment_id
	 * @return array|null
	 */
	public function get_with_details( $appointment_id ) {
		$result = $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT a.*, 
				s.slot_date, s.start_time, s.end_time,
				u.display_name as user_name, u.user_email,
				admin.display_name as admin_name,
				sch.name as schedule_name
				FROM {$this->table_name} a
				LEFT JOIN {$this->wpdb->prefix}nobat_slots s ON a.slot_id = s.id
				LEFT JOIN {$this->wpdb->prefix}users u ON a.user_id = u.ID
				LEFT JOIN {$this->wpdb->prefix}users admin ON a.assigned_admin_id = admin.ID
				LEFT JOIN {$this->wpdb->prefix}nobat_schedules sch ON a.schedule_id = sch.id
				WHERE a.id = %d",
				$appointment_id
			),
			ARRAY_A
		);
		
		if ( $result ) {
			// Add Jalali date to appointment data
			if ( ! empty( $result['slot_date'] ) ) {
				$jalali_date = \Nobat\Utilities\DateTimeHelper::gregorian_to_jalali( $result['slot_date'] );
				$result['slot_date_jalali'] = $jalali_date ? $jalali_date : $result['slot_date'];
			}
		}
		
		return $result ?: null;
	}
	
	/**
	 * Check if user has appointment for a specific slot
	 * 
	 * @param int $user_id
	 * @param int $slot_id
	 * @return bool
	 */
	public function user_has_slot_booked( $user_id, $slot_id ) {
		$count = $this->wpdb->get_var(
			$this->wpdb->prepare(
				"SELECT COUNT(*) FROM {$this->table_name} 
				WHERE user_id = %d AND slot_id = %d AND status NOT IN ('cancelled')",
				$user_id,
				$slot_id
			)
		);
		
		return $count > 0;
	}
}

