<?php
/**
 * Slot Controller
 * 
 * Handles REST API requests for appointment slots
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Controllers;

use Nobat\Services\SlotService;
use Nobat\Services\AuthService;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Slot Controller class
 */
class SlotController {
	
	/**
	 * Slot service
	 * 
	 * @var SlotService
	 */
	private $slot_service;
	
	/**
	 * Auth service
	 * 
	 * @var AuthService
	 */
	private $auth_service;
	
	/**
	 * Constructor
	 * 
	 * @param SlotService|null $slot_service
	 * @param AuthService|null $auth_service
	 */
	public function __construct( $slot_service = null, $auth_service = null ) {
		// Use dependency injection or fallback to container
		if ( $slot_service !== null ) {
			$this->slot_service = $slot_service;
		} else {
			$this->slot_service = nobat_service( 'slot_service' );
		}
		
		if ( $auth_service !== null ) {
			$this->auth_service = $auth_service;
		} else {
			$this->auth_service = nobat_service( 'auth_service' );
		}
	}
	
	/**
	 * Get available slots
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_available( $request ) {
		$days = $request->get_param( 'days' );
		$days = $days ? (int) $days : 7;
		
		$result = $this->slot_service->get_available_slots( $days );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'days' => $result
			),
			200
		);
	}
	
	/**
	 * Get slots for a specific date
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_by_date( $request ) {
		$date = $request->get_param( 'date' );
		$schedule_id = $request->get_param( 'schedule_id' );
		
		if ( ! $date ) {
			return new WP_Error(
				'missing_date',
				__( 'Date parameter is required.', 'nobat' ),
				array( 'status' => 400 )
			);
		}
		
		$result = $this->slot_service->get_slots_for_date(
			$date,
			$schedule_id ? (int) $schedule_id : null
		);
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'date' => $date,
				'slots' => $result
			),
			200
		);
	}
	
	/**
	 * Get slots for a schedule
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_by_schedule( $request ) {
		$schedule_id = $request->get_param( 'schedule_id' );
		$status = $request->get_param( 'status' );
		$date_from = $request->get_param( 'date_from' );
		$date_to = $request->get_param( 'date_to' );
		
		$args = array();
		
		if ( $status ) {
			$args['status'] = $status;
		}
		
		if ( $date_from ) {
			$args['date_from'] = $date_from;
		}
		
		if ( $date_to ) {
			$args['date_to'] = $date_to;
		}
		
		$slots = $this->slot_service->get_slots_for_schedule( (int) $schedule_id, $args );
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'slots' => $slots,
				'count' => count( $slots )
			),
			200
		);
	}
	
	/**
	 * Block a slot (admin only)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function block( $request ) {
		$slot_id = $request->get_param( 'id' );
		
		$result = $this->slot_service->block_slot( $slot_id );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Slot blocked successfully.', 'nobat' )
			),
			200
		);
	}
	
	/**
	 * Unblock a slot (admin only)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function unblock( $request ) {
		$slot_id = $request->get_param( 'id' );
		
		$result = $this->slot_service->unblock_slot( $slot_id );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Slot unblocked successfully.', 'nobat' )
			),
			200
		);
	}

	/**
	 * Update slot status by schedule ID, date, and time slot
	 * Creates a new slot if it doesn't exist (for unavailable → available/blocked conversions)
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_by_schedule_and_time( $request ) {
		global $wpdb;

		$schedule_id = $request->get_param( 'schedule_id' );
		$date = $request->get_param( 'date' );
		$time_slot = $request->get_param( 'time_slot' );
		$status = $request->get_param( 'status' );

		// Parse time slot (e.g., "09:00-09:30")
		$time_parts = explode( '-', $time_slot );
		$start_time = isset( $time_parts[0] ) ? trim( $time_parts[0] ) : '';
		$end_time = isset( $time_parts[1] ) ? trim( $time_parts[1] ) : '';
		
		// Add seconds if not present
		if ( strlen( $start_time ) === 5 ) {
			$start_time .= ':00';
		}
		if ( strlen( $end_time ) === 5 ) {
			$end_time .= ':00';
		}

		// Validate we have both start and end times
		if ( empty( $end_time ) ) {
			return new \WP_Error(
				'invalid_time_slot',
				__( 'Time slot must include both start and end time (e.g., 09:00-10:00).', 'nobat' ),
				array( 'status' => 400 )
			);
		}

		// Find the slot
		$slot_repository = nobat_service( 'slot_repository' );
		$slots_table = $wpdb->prefix . 'nobat_slots';

		$slot = $wpdb->get_row( $wpdb->prepare(
			"SELECT * FROM $slots_table 
			WHERE schedule_id = %d 
			AND slot_date = %s 
			AND start_time = %s",
			$schedule_id,
			$date,
			$start_time
		), ARRAY_A );

		if ( ! $slot ) {
			// Slot doesn't exist - create it
			// This allows converting unavailable slots to available/blocked
			$slot_id = $slot_repository->insert( array(
				'schedule_id' => $schedule_id,
				'slot_date' => $date,
				'start_time' => $start_time,
				'end_time' => $end_time,
				'status' => $status,
				'created_at' => current_time( 'mysql' ),
				'updated_at' => current_time( 'mysql' )
			) );

			if ( ! $slot_id ) {
				return new \WP_Error(
					'create_failed',
					__( 'Failed to create slot.', 'nobat' ),
					array( 'status' => 500 )
				);
			}

			return new \WP_REST_Response(
				array(
					'success' => true,
					'message' => __( 'Slot created successfully.', 'nobat' ),
					'created' => true
				),
				201
			);
		}

		// Slot exists - update it
		$result = $slot_repository->update( $slot['id'], array( 'status' => $status ) );

		if ( ! $result ) {
			return new \WP_Error(
				'update_failed',
				__( 'Failed to update slot status.', 'nobat' ),
				array( 'status' => 500 )
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Slot status updated successfully.', 'nobat' ),
				'created' => false
			),
			200
		);
	}
}

