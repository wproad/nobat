<?php
/**
 * Schedule List Table
 *
 * Displays the list of schedules in admin
 *
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Schedule List Table class
 */
class ScheduleListTable extends \WP_List_Table {

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( [
			'singular' => __( 'Schedule', 'nobat' ),
			'plural'   => __( 'Schedules', 'nobat' ),
			'ajax'     => false,
		] );
	}

	/**
	 * Get table columns
	 *
	 * @return array
	 */
	public function get_columns() {
		return [
			'id'               => __( 'ID', 'nobat' ),
			'name'             => __( 'Schedule Name', 'nobat' ),
			'start_date'       => __( 'Start Date', 'nobat' ),
			'end_date'         => __( 'End Date', 'nobat' ),
			'meeting_duration' => __( 'Duration (min)', 'nobat' ),
			'is_active'        => __( 'Status', 'nobat' ),
			'created_at'       => __( 'Created At', 'nobat' ),
		];
	}

	/**
	 * Render name column with actions
	 *
	 * @param array $item
	 * @return string
	 */
	protected function column_name( $item ) {
		$actions = [
			'delete' => sprintf(
				'<a href="%s" onclick="return confirm(\'%s\');">%s</a>',
				wp_nonce_url( admin_url( 'admin.php?page=nobat-schedules&action=delete&id=' . intval( $item['id'] ) ), 'delete_schedule_' . intval( $item['id'] ) ),
				esc_js( __( 'Are you sure you want to delete this schedule?', 'nobat' ) ),
				__( 'Delete', 'nobat' )
			),
			'show' => sprintf(
				'<a href="%s">%s</a>',
				esc_url( admin_url( 'admin.php?page=nobat-cal&schedule_id=' . intval( $item['id'] ) ) ),
				__( 'Show Calendar View', 'nobat' )
			),
		];

		return sprintf(
			'<strong>%s</strong> %s',
			esc_html( $item['name'] ),
			$this->row_actions( $actions )
		);
	}

	/**
	 * Render is_active column with colored badge
	 *
	 * @param array $item
	 * @return string
	 */
	public function column_is_active( $item ) {
		$is_active = intval( $item['is_active'] );
		
		if ( $is_active ) {
			return sprintf(
				'<span style="background-color:#5cb85c; color:#fff; padding:3px 8px; border-radius:6px; font-size:12px;">%s</span>',
				esc_html__( 'Active', 'nobat' )
			);
		} else {
			return sprintf(
				'<span style="background-color:#777; color:#fff; padding:3px 8px; border-radius:6px; font-size:12px;">%s</span>',
				esc_html__( 'Inactive', 'nobat' )
			);
		}
	}

	/**
	 * Render default column
	 *
	 * @param array $item
	 * @param string $column_name
	 * @return string
	 */
	protected function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'id':
			case 'start_date':
			case 'end_date':
			case 'meeting_duration':
			case 'created_at':
				return esc_html( $item[ $column_name ] );
			default:
				return '';
		}
	}

	/**
	 * Add extra table navigation (filters)
	 *
	 * @param string $which
	 */
	public function extra_tablenav( $which ) {
		if ( 'top' === $which ) {
			$selected_status = isset( $_GET['status_filter'] ) ? sanitize_text_field( $_GET['status_filter'] ) : '';

			echo '<div class="alignleft actions">';

			// Status filter
			echo '<select name="status_filter">';
			echo '<option value="">' . esc_html__( 'All Statuses', 'nobat' ) . '</option>';
			echo '<option value="1" ' . selected( $selected_status, '1', false ) . '>' . esc_html__( 'Active', 'nobat' ) . '</option>';
			echo '<option value="0" ' . selected( $selected_status, '0', false ) . '>' . esc_html__( 'Inactive', 'nobat' ) . '</option>';
			echo '</select>';
			
			submit_button( __( 'Filter' ), '', 'filter_action', false );
			echo '</div>';
		}
	}

	/**
	 * Prepare table items
	 */
	public function prepare_items() {
		global $wpdb;
		$table = $wpdb->prefix . 'nobat_schedules';

		$this->process_bulk_action();

		$where = '1=1';
		
		// Status filter
		if ( isset( $_GET['status_filter'] ) && $_GET['status_filter'] !== '' ) {
			$where .= $wpdb->prepare( ' AND is_active = %d', intval( $_GET['status_filter'] ) );
		}

		// Pagination
		$per_page     = 30;
		$current_page = $this->get_pagenum();
		$total_items  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $table WHERE $where" );

		$offset = ( $current_page - 1 ) * $per_page;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE $where ORDER BY id DESC LIMIT %d, %d",
				$offset,
				$per_page
			),
			ARRAY_A
		);

		$this->items = $results;

		$this->_column_headers = [ $this->get_columns(), [], [] ];
		$this->set_pagination_args( [
			'total_items' => $total_items,
			'per_page'    => $per_page,
		] );
	}
}

