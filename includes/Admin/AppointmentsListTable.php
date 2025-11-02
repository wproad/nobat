<?php
/**
 * Appointments List Table
 *
 * Displays the list of appointments in admin
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
 * Appointments List Table class
 */
class AppointmentsListTable extends \WP_List_Table {

	/**
	 * Available status values
	 *
	 * @var array
	 */
	private $statuses = [ 'pending', 'confirmed', 'cancelled', 'completed', 'cancel_requested' ];

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( [
			'singular' => __( 'Appointment', 'nobat' ),
			'plural'   => __( 'Appointments', 'nobat' ),
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
			'client_name'      => __( 'Client Name', 'nobat' ),
			'client_phone'     => __( 'Client Phone', 'nobat' ),
			'appointment_date' => __( 'Date', 'nobat' ),
			'time_slot'        => __( 'Time Slot', 'nobat' ),
			'status'           => __( 'Status', 'nobat' ),
			'created_at'       => __( 'Created At', 'nobat' ),
		];
	}

	/**
	 * Render client name column with actions
	 *
	 * @param array $item
	 * @return string
	 */
	protected function column_client_name( $item ) {
		$actions   = [
			'delete' => sprintf(
				'<a href="%s" onclick="return confirm(\'%s\');">%s</a>',
				wp_nonce_url( admin_url( 'admin.php?page=nobat-appointments&action=delete&id=' . intval( $item['id'] ) ), 'delete_appointment_' . intval( $item['id'] ) ),
				esc_js( __( 'Are you sure you want to delete this appointment?', 'nobat' ) ),
				__( 'Delete', 'nobat' )
			),
		];

		return sprintf(
			'<strong>%s</strong> %s',
			esc_html( $item['client_name'] ),
			$this->row_actions( $actions )
		);
	}

	/**
	 * Render status column with colored badge
	 *
	 * @param array $item
	 * @return string
	 */
	public function column_status( $item ) {
		$status = esc_html( $item['status'] );

	$colors = array(
		'pending'   => '#f0ad4e',
		'confirmed' => '#5cb85c',
		'completed' => '#337ab7',
		'cancelled' => '#d9534f',
		'cancel_requested' => '#e67e22',
	);
		$color = isset( $colors[ $status ] ) ? $colors[ $status ] : '#777';

		return sprintf(
			'<span style="background-color:%s; color:#fff; padding:3px 8px; border-radius:6px; font-size:12px; text-transform:capitalize;">%s</span>',
			esc_attr( $color ),
			$status
		);
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
			case 'client_phone':
			case 'appointment_date':
			case 'time_slot':
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
			$selected_date   = isset( $_GET['date_filter'] ) ? sanitize_text_field( $_GET['date_filter'] ) : '';

			echo '<div class="alignleft actions">';

			// Status filter
			echo '<select name="status_filter">';
			echo '<option value="">' . esc_html__( 'All Statuses', 'nobat' ) . '</option>';
			foreach ( $this->statuses as $status ) {
				printf(
					'<option value="%1$s" %2$s>%3$s</option>',
					esc_attr( $status ),
					selected( $selected_status, $status, false ),
					esc_html( ucfirst( $status ) )
				);
			}
			echo '</select>';
			submit_button( __( 'Filter' ), '', 'filter_action', false );

			// Date filter
			printf(
				'<input type="date" name="date_filter" value="%s" placeholder="%s" />',
				esc_attr( $selected_date ),
				esc_attr__( 'Select date', 'nobat' )
			);

			submit_button( __( 'Filter' ), '', 'filter_action', false );
			echo '</div>';
		}
	}

	/**
	 * Prepare table items
	 */
	public function prepare_items() {
		global $wpdb;
		$appointments_table = $wpdb->prefix . 'nobat_appointments';
		$slots_table = $wpdb->prefix . 'nobat_slots';
		$users_table = $wpdb->prefix . 'users';

		$this->process_bulk_action();

		$where = '1=1';
		
		// Status filter
		if ( ! empty( $_GET['status_filter'] ) ) {
			$where .= $wpdb->prepare( ' AND a.status = %s', sanitize_text_field( $_GET['status_filter'] ) );
		}

		// Date filter
		if ( ! empty( $_GET['date_filter'] ) ) {
			$where .= $wpdb->prepare( ' AND s.slot_date = %s', sanitize_text_field( $_GET['date_filter'] ) );
		}

		// Pagination
		$per_page     = 30;
		$current_page = $this->get_pagenum();
		$total_items  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $appointments_table a WHERE $where" );

		$offset = ( $current_page - 1 ) * $per_page;
		$usermeta_table = $wpdb->prefix . 'usermeta';
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT 
					a.id,
					a.status,
					a.created_at,
					u.display_name as client_name,
					COALESCE(um.meta_value, u.user_email) as client_phone,
					s.slot_date as appointment_date,
					CONCAT(TIME_FORMAT(s.start_time, '%%H:%%i'), '-', TIME_FORMAT(s.end_time, '%%H:%%i')) as time_slot
				FROM $appointments_table a
				LEFT JOIN $users_table u ON a.user_id = u.ID
				LEFT JOIN $slots_table s ON a.slot_id = s.id
				LEFT JOIN $usermeta_table um ON u.ID = um.user_id AND um.meta_key = 'phone'
				WHERE $where 
				ORDER BY a.id DESC 
				LIMIT %d, %d",
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

