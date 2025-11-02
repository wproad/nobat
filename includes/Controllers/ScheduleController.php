<?php
/**
 * Schedule Controller
 * 
 * Handles REST API requests for schedules
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Controllers;

use Nobat\Services\ScheduleService;
use Nobat\Services\AuthService;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Schedule Controller class
 */
class ScheduleController {
	
	/**
	 * Schedule service
	 * 
	 * @var ScheduleService
	 */
	private $schedule_service;
	
	/**
	 * Auth service
	 * 
	 * @var AuthService
	 */
	private $auth_service;
	
	/**
	 * Constructor
	 * 
	 * @param ScheduleService|null $schedule_service
	 * @param AuthService|null $auth_service
	 */
	public function __construct( $schedule_service = null, $auth_service = null ) {
		// Use dependency injection or fallback to container
		if ( $schedule_service !== null ) {
			$this->schedule_service = $schedule_service;
		} else {
			$this->schedule_service = nobat_service( 'schedule_service' );
		}
		
		if ( $auth_service !== null ) {
			$this->auth_service = $auth_service;
		} else {
			$this->auth_service = nobat_service( 'auth_service' );
		}
	}
	
	/**
	 * Create a new schedule
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function create( $request ) {
		$data = $request->get_json_params();
		
		// Validate required fields (support both camelCase from frontend and snake_case)
		$name = $data['name'] ?? '';
		$start_date = $data['startDate'] ?? ( $data['start_date'] ?? '' );
		$end_date = $data['endDate'] ?? ( $data['end_date'] ?? '' );
		$meeting_duration = $data['meetingDuration'] ?? ( $data['meeting_duration'] ?? 0 );
		$weekly_hours = $data['weeklyHours'] ?? ( $data['working_hours'] ?? array() );
		
		if ( empty( $name ) || empty( $start_date ) || empty( $end_date ) || empty( $weekly_hours ) ) {
			return new WP_Error(
				'missing_field',
				__( 'Missing required fields: name, startDate, endDate, or weeklyHours', 'nobat' ),
				array( 'status' => 400 )
			);
		}
		
		// Convert Jalali dates to Gregorian before validation
		// Accept both Jalali (YYYY/MM/DD) and Gregorian (YYYY-MM-DD) formats
		$start_date_gregorian = convertJalaliToGregorian( $start_date );
		$end_date_gregorian = convertJalaliToGregorian( $end_date );
		
		// If conversion failed, assume date was already in Gregorian format
		if ( false === $start_date_gregorian ) {
			// Check if it's already in Gregorian format
			if ( preg_match( '/^\d{4}-\d{2}-\d{2}$/', $start_date ) ) {
				$start_date_gregorian = $start_date;
			} else {
				return new WP_Error(
					'invalid_date',
					__( 'Invalid date format. Expected Jalali (YYYY/MM/DD) or Gregorian (YYYY-MM-DD)', 'nobat' ),
					array( 'status' => 400 )
				);
			}
		}
		
		if ( false === $end_date_gregorian ) {
			// Check if it's already in Gregorian format
			if ( preg_match( '/^\d{4}-\d{2}-\d{2}$/', $end_date ) ) {
				$end_date_gregorian = $end_date;
			} else {
				return new WP_Error(
					'invalid_date',
					__( 'Invalid date format. Expected Jalali (YYYY/MM/DD) or Gregorian (YYYY-MM-DD)', 'nobat' ),
					array( 'status' => 400 )
				);
			}
		}
		
		// Validate Gregorian date format (YYYY-MM-DD)
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $start_date_gregorian ) || ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $end_date_gregorian ) ) {
			return new WP_Error(
				'invalid_date',
				__( 'Invalid date format after conversion. Expected YYYY-MM-DD (Gregorian)', 'nobat' ),
				array( 'status' => 400 )
			);
		}
		
		// Transform weekly hours from frontend format to service format
		$working_hours = array();
		foreach ( $weekly_hours as $day => $periods ) {
			if ( ! is_array( $periods ) || empty( $periods ) ) {
				continue;
			}
			
			foreach ( $periods as $period ) {
				// Support both "09:00-17:00" string or {start,end} object
				if ( is_string( $period ) ) {
					$parts = explode( '-', $period );
					$period = array(
						'start' => trim( $parts[0] ?? '' ),
						'end'   => trim( $parts[1] ?? '' ),
					);
				}
				
				if ( empty( $period['start'] ) || empty( $period['end'] ) ) {
					continue;
				}
				
				$working_hours[] = array(
					'day_of_week' => strtolower( substr( $day, 0, 3 ) ), // "monday" -> "mon"
					'start_time'  => $period['start'] . ':00', // Add seconds
					'end_time'    => $period['end'] . ':00',
				);
			}
		}
		
		// Sanitize and prepare data (use converted Gregorian dates)
		$schedule_data = array(
			'name' => sanitize_text_field( $name ),
			'is_active' => ! empty( $data['isActive'] ) || ! empty( $data['is_active'] ) ? 1 : 0,
			'start_date' => sanitize_text_field( $start_date_gregorian ),
			'end_date' => sanitize_text_field( $end_date_gregorian ),
			'meeting_duration' => (int) $meeting_duration,
			'buffer_time' => isset( $data['buffer'] ) ? (int) $data['buffer'] : ( isset( $data['buffer_time'] ) ? (int) $data['buffer_time'] : 0 ),
			'working_hours' => $working_hours
		);
		
		$result = $this->schedule_service->create_schedule( $schedule_data );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Schedule created successfully.', 'nobat' ),
				'schedule' => $result
			),
			201
		);
	}
	
	/**
	 * Get all schedules
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function get_all( $request ) {
		$schedules = $this->schedule_service->get_all_schedules();
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'schedules' => $schedules,
				'count' => count( $schedules )
			),
			200
		);
	}
	
	/**
	 * Get active schedule
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_active( $request ) {
		$schedule = $this->schedule_service->get_active_schedule();
		
		if ( ! $schedule ) {
			return new WP_Error(
				'no_active_schedule',
				__( 'No active schedule found.', 'nobat' ),
				array( 'status' => 404 )
			);
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'schedule' => $schedule
			),
			200
		);
	}
	
	/**
	 * Get single schedule
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_one( $request ) {
		$schedule_id = $request->get_param( 'id' );
		
		$schedule = $this->schedule_service->get_schedule( $schedule_id );
		
		if ( ! $schedule ) {
			return new WP_Error(
				'not_found',
				__( 'Schedule not found.', 'nobat' ),
				array( 'status' => 404 )
			);
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'schedule' => $schedule
			),
			200
		);
	}
	
	/**
	 * Activate a schedule
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function activate( $request ) {
		$schedule_id = $request->get_param( 'id' );
		
		$result = $this->schedule_service->activate_schedule( $schedule_id );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Schedule activated successfully.', 'nobat' )
			),
			200
		);
	}
	
	/**
	 * Delete a schedule
	 * 
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete( $request ) {
		$schedule_id = $request->get_param( 'id' );
		
		$result = $this->schedule_service->delete_schedule( $schedule_id );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		
		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Schedule deleted successfully.', 'nobat' )
			),
			200
		);
	}
}

