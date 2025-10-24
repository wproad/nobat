<?php
/**
 * Slot Service
 * 
 * Handles business logic for appointment slots
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Services;

use Nobat\Repositories\SlotRepository;
use Nobat\Repositories\ScheduleRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Slot Service class
 */
class SlotService {
	
	/**
	 * Slot repository
	 * 
	 * @var SlotRepository
	 */
	private $slot_repo;
	
	/**
	 * Schedule repository
	 * 
	 * @var ScheduleRepository
	 */
	private $schedule_repo;
	
	/**
	 * Constructor
	 * 
	 * @param SlotRepository|null $slot_repo
	 * @param ScheduleRepository|null $schedule_repo
	 */
	public function __construct( $slot_repo = null, $schedule_repo = null ) {
		$this->slot_repo = $slot_repo ?: new SlotRepository();
		$this->schedule_repo = $schedule_repo ?: new ScheduleRepository();
	}
	
	/**
	 * Get available slots for active schedule
	 * 
	 * @param int $days Number of days to retrieve (default 7)
	 * @return array|WP_Error
	 */
	public function get_available_slots( $days = 7 ) {
		// Get active schedule
		$schedule = $this->schedule_repo->find_active();
		
		if ( ! $schedule ) {
			return new WP_Error(
				'no_schedule',
				__( 'No active schedule found.', 'nobat' ),
				array( 'status' => 404 )
			);
		}
		
		$today = current_time( 'Y-m-d' );
		$end_date = date( 'Y-m-d', strtotime( "+{$days} days" ) );
		
		// Get available slots
		$slots = $this->slot_repo->find_available(
			$schedule['id'],
			$today,
			$end_date,
			null
		);
		
		// Group by date
		return $this->slot_repo->get_grouped_by_date(
			$schedule['id'],
			$today,
			$end_date
		);
	}
	
	/**
	 * Get slots for a specific date
	 * 
	 * @param string $date
	 * @param int|null $schedule_id
	 * @return array|WP_Error
	 */
	public function get_slots_for_date( $date, $schedule_id = null ) {
		if ( ! $schedule_id ) {
			$schedule = $this->schedule_repo->find_active();
			
			if ( ! $schedule ) {
				return new WP_Error( 'no_schedule', __( 'No active schedule found.', 'nobat' ), array( 'status' => 404 ) );
			}
			
			$schedule_id = $schedule['id'];
		}
		
		return $this->slot_repo->find_by_date( $schedule_id, $date );
	}
	
	/**
	 * Get slots for schedule
	 * 
	 * @param int $schedule_id
	 * @param array $args
	 * @return array
	 */
	public function get_slots_for_schedule( $schedule_id, $args = array() ) {
		return $this->slot_repo->find_by_schedule( $schedule_id, $args );
	}
	
	/**
	 * Block a slot (admin action)
	 * 
	 * @param int $slot_id
	 * @return bool|WP_Error
	 */
	public function block_slot( $slot_id ) {
		$slot = $this->slot_repo->find( $slot_id );
		
		if ( ! $slot ) {
			return new WP_Error( 'not_found', __( 'Slot not found.', 'nobat' ), array( 'status' => 404 ) );
		}
		
		if ( $slot['status'] === 'booked' ) {
			return new WP_Error( 'already_booked', __( 'Cannot block a booked slot.', 'nobat' ), array( 'status' => 400 ) );
		}
		
		$success = $this->slot_repo->mark_as_blocked( $slot_id );
		
		if ( ! $success ) {
			return new WP_Error( 'update_failed', __( 'Failed to block slot.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		return true;
	}
	
	/**
	 * Unblock a slot (admin action)
	 * 
	 * @param int $slot_id
	 * @return bool|WP_Error
	 */
	public function unblock_slot( $slot_id ) {
		$slot = $this->slot_repo->find( $slot_id );
		
		if ( ! $slot ) {
			return new WP_Error( 'not_found', __( 'Slot not found.', 'nobat' ), array( 'status' => 404 ) );
		}
		
		if ( $slot['status'] !== 'blocked' ) {
			return new WP_Error( 'not_blocked', __( 'Slot is not blocked.', 'nobat' ), array( 'status' => 400 ) );
		}
		
		$success = $this->slot_repo->mark_as_available( $slot_id );
		
		if ( ! $success ) {
			return new WP_Error( 'update_failed', __( 'Failed to unblock slot.', 'nobat' ), array( 'status' => 500 ) );
		}
		
		return true;
	}
	
	/**
	 * Check if slot is available
	 * 
	 * @param int $slot_id
	 * @return bool
	 */
	public function is_slot_available( $slot_id ) {
		return $this->slot_repo->is_available( $slot_id );
	}
	
	/**
	 * Get slot by ID
	 * 
	 * @param int $slot_id
	 * @return array|null
	 */
	public function get_slot( $slot_id ) {
		return $this->slot_repo->find( $slot_id );
	}
	
	/**
	 * Count available slots for schedule
	 * 
	 * @param int $schedule_id
	 * @param string|null $date_from
	 * @param string|null $date_to
	 * @return int
	 */
	public function count_available_slots( $schedule_id, $date_from = null, $date_to = null ) {
		return $this->slot_repo->count_available( $schedule_id, $date_from, $date_to );
	}
}

