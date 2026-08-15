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
	 * Statuses that can be applied in bulk
	 *
	 * @var array
	 */
	private $bulk_statuses = [ 'confirmed', 'completed', 'cancelled' ];

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( [
			'singular' => 'appointment',
			'plural'   => 'appointments',
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
			'cb'                  => '<input type="checkbox" />',
			'id'                  => __( 'ID', 'nobat' ),
			'client_name'         => __( 'Client Name', 'nobat' ),
			'client_phone'        => __( 'Client Phone', 'nobat' ),
			'calendar'            => __( 'Calendar', 'nobat' ),
			'appointment_date'    => __( 'Date', 'nobat' ),
			'time_slot'           => __( 'Time Slot', 'nobat' ),
			'status'              => __( 'Status', 'nobat' ),
			'assigned_admin'      => __( 'Assigned Admin', 'nobat' ),
			'cancellation_reason' => __( 'Cancellation Reason', 'nobat' ),
			'created_at'          => __( 'Created At', 'nobat' ),
		];
	}

	/**
	 * Bulk actions shown in the dropdown
	 *
	 * @return array
	 */
	protected function get_bulk_actions() {
		return [
			'edit'   => __( 'Edit', 'nobat' ),
			'delete' => __( 'Delete', 'nobat' ),
		];
	}

	/**
	 * Checkbox column
	 *
	 * @param array $item
	 * @return string
	 */
	protected function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="appointment[]" value="%s" />',
			esc_attr( $item['id'] )
		);
	}

	/**
	 * Render client name column with actions
	 *
	 * @param array $item
	 * @return string
	 */
	protected function column_client_name( $item ) {
		$actions = [
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
	 * Render calendar (schedule) column
	 *
	 * @param array $item
	 * @return string
	 */
	protected function column_calendar( $item ) {
		if ( empty( $item['schedule_name'] ) ) {
			return '<span style="color: #999;">—</span>';
		}

		$url = admin_url( 'admin.php?page=nobat&schedule_id=' . intval( $item['schedule_id'] ) );

		return sprintf(
			'<a href="%s">%s</a>',
			esc_url( $url ),
			esc_html( $item['schedule_name'] )
		);
	}

	/**
	 * Render status column with colored badge
	 *
	 * @param array $item
	 * @return string
	 */
	public function column_status( $item ) {
		$status = $item['status'];
		$colors = array(
			'pending'          => '#f0ad4e',
			'confirmed'        => '#5cb85c',
			'completed'        => '#337ab7',
			'cancelled'        => '#d9534f',
			'cancel_requested' => '#e67e22',
		);
		$color = isset( $colors[ $status ] ) ? $colors[ $status ] : '#777';

		return sprintf(
			'<span style="background-color:%s; color:#fff; padding:3px 8px; border-radius:6px; font-size:12px;">%s</span>',
			esc_attr( $color ),
			esc_html( $this->get_status_label( $status ) )
		);
	}

	/**
	 * Render default column
	 *
	 * @param array  $item
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
			case 'assigned_admin':
				return ! empty( $item[ $column_name ] )
					? esc_html( $item[ $column_name ] )
					: '<span style="color: #999;">—</span>';
			case 'cancellation_reason':
				if ( ! empty( $item[ $column_name ] ) ) {
					return sprintf(
						'<span style="color: #d9534f; font-style: italic;">%s</span>',
						esc_html( $item[ $column_name ] )
					);
				}
				return '<span style="color: #999;">—</span>';
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
		if ( 'top' !== $which ) {
			return;
		}

		global $wpdb;

		$selected_status   = isset( $_GET['status_filter'] ) ? sanitize_text_field( wp_unslash( $_GET['status_filter'] ) ) : '';
		$selected_date     = isset( $_GET['date_filter'] ) ? sanitize_text_field( wp_unslash( $_GET['date_filter'] ) ) : '';
		$selected_admin    = isset( $_GET['admin_filter'] ) ? intval( $_GET['admin_filter'] ) : 0;
		$selected_calendar = isset( $_GET['calendar_filter'] ) ? intval( $_GET['calendar_filter'] ) : 0;

		echo '<div class="alignleft actions">';

		echo '<select name="status_filter" style="margin-right: 8px;">';
		echo '<option value="">' . esc_html__( 'All Statuses', 'nobat' ) . '</option>';
		foreach ( $this->statuses as $status ) {
			printf(
				'<option value="%1$s" %2$s>%3$s</option>',
				esc_attr( $status ),
				selected( $selected_status, $status, false ),
				esc_html( $this->get_status_label( $status ) )
			);
		}
		echo '</select>';

		$schedules = $wpdb->get_results(
			"SELECT id, name FROM {$wpdb->prefix}nobat_schedules ORDER BY name ASC"
		);

		if ( ! empty( $schedules ) ) {
			echo '<select name="calendar_filter" style="margin-right: 8px;">';
			echo '<option value="">' . esc_html__( 'All Calendars', 'nobat' ) . '</option>';
			foreach ( $schedules as $schedule ) {
				printf(
					'<option value="%1$d" %2$s>%3$s</option>',
					(int) $schedule->id,
					selected( $selected_calendar, (int) $schedule->id, false ),
					esc_html( $schedule->name )
				);
			}
			echo '</select>';
		}

		$admins = $wpdb->get_results(
			"SELECT DISTINCT admin.ID, admin.display_name
			FROM {$wpdb->prefix}nobat_appointments a
			LEFT JOIN {$wpdb->prefix}users admin ON a.assigned_admin_id = admin.ID
			WHERE a.assigned_admin_id IS NOT NULL
			ORDER BY admin.display_name ASC"
		);

		if ( ! empty( $admins ) ) {
			echo '<select name="admin_filter" style="margin-right: 8px;">';
			echo '<option value="">' . esc_html__( 'All Admins', 'nobat' ) . '</option>';
			foreach ( $admins as $admin ) {
				printf(
					'<option value="%1$d" %2$s>%3$s</option>',
					(int) $admin->ID,
					selected( $selected_admin, (int) $admin->ID, false ),
					esc_html( $admin->display_name )
				);
			}
			echo '</select>';
		}

		printf(
			'<input type="date" name="date_filter" value="%s" placeholder="%s" style="margin-right: 8px;" />',
			esc_attr( $selected_date ),
			esc_attr__( 'Select date', 'nobat' )
		);

		submit_button( __( 'Filter', 'nobat' ), 'button', 'filter_action', false );

		if ( $selected_status || $selected_date || $selected_admin || $selected_calendar ) {
			echo ' ';
			printf(
				'<a href="%s" class="button">%s</a>',
				esc_url( admin_url( 'admin.php?page=nobat-appointments' ) ),
				esc_html__( 'Clear', 'nobat' )
			);
		}

		echo '</div>';
	}

	/**
	 * Prepare table items
	 */
	public function prepare_items() {
		global $wpdb;
		$appointments_table = $wpdb->prefix . 'nobat_appointments';
		$slots_table        = $wpdb->prefix . 'nobat_slots';
		$schedules_table    = $wpdb->prefix . 'nobat_schedules';
		$users_table        = $wpdb->prefix . 'users';
		$usermeta_table     = $wpdb->prefix . 'usermeta';

		$where = '1=1';

		if ( ! empty( $_GET['status_filter'] ) ) {
			$where .= $wpdb->prepare( ' AND a.status = %s', sanitize_text_field( wp_unslash( $_GET['status_filter'] ) ) );
		}

		if ( ! empty( $_GET['date_filter'] ) ) {
			$where .= $wpdb->prepare( ' AND s.slot_date = %s', sanitize_text_field( wp_unslash( $_GET['date_filter'] ) ) );
		}

		if ( ! empty( $_GET['admin_filter'] ) ) {
			$where .= $wpdb->prepare( ' AND a.assigned_admin_id = %d', intval( $_GET['admin_filter'] ) );
		}

		if ( ! empty( $_GET['calendar_filter'] ) ) {
			$where .= $wpdb->prepare( ' AND a.schedule_id = %d', intval( $_GET['calendar_filter'] ) );
		}

		$joins = "LEFT JOIN $slots_table s ON a.slot_id = s.id
			LEFT JOIN $schedules_table sch ON a.schedule_id = sch.id";

		$per_page     = 30;
		$current_page = $this->get_pagenum();
		$total_items  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM $appointments_table a $joins WHERE $where" );

		$offset  = ( $current_page - 1 ) * $per_page;
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT
					a.id,
					a.status,
					a.created_at,
					a.cancellation_reason,
					a.schedule_id,
					sch.name as schedule_name,
					u.display_name as client_name,
					COALESCE(um.meta_value, u.user_email) as client_phone,
					admin.display_name as assigned_admin,
					s.slot_date as appointment_date,
					CONCAT(TIME_FORMAT(s.start_time, '%%H:%%i'), '-', TIME_FORMAT(s.end_time, '%%H:%%i')) as time_slot
				FROM $appointments_table a
				LEFT JOIN $users_table u ON a.user_id = u.ID
				LEFT JOIN $slots_table s ON a.slot_id = s.id
				LEFT JOIN $schedules_table sch ON a.schedule_id = sch.id
				LEFT JOIN $usermeta_table um ON u.ID = um.user_id AND um.meta_key = 'phone'
				LEFT JOIN $users_table admin ON a.assigned_admin_id = admin.ID
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

	/**
	 * Render the hidden bulk-edit form (status + assigned admin).
	 */
	public function display_bulk_edit_form() {
		$admins = get_users( array( 'role' => 'administrator' ) );

		$preserve = array( 'status_filter', 'date_filter', 'admin_filter', 'calendar_filter', 'paged' );
		?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=nobat-appointments' ) ); ?>" id="nobat-bulk-edit-form" class="nobat-bulk-edit" hidden>
			<?php wp_nonce_field( 'nobat_bulk_edit_appointments' ); ?>
			<input type="hidden" name="nobat_bulk_edit" value="1" />
			<div id="nobat-bulk-edit-ids"></div>
			<?php foreach ( $preserve as $key ) : ?>
				<?php if ( ! empty( $_GET[ $key ] ) ) : ?>
					<input type="hidden" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( wp_unslash( $_GET[ $key ] ) ); ?>" />
				<?php endif; ?>
			<?php endforeach; ?>

			<h2><?php echo esc_html__( 'Bulk Edit', 'nobat' ); ?></h2>
			<p class="nobat-bulk-edit-count" id="nobat-bulk-edit-count"></p>

			<div class="nobat-bulk-edit-fields">
				<label>
					<span><?php echo esc_html__( 'Status', 'nobat' ); ?></span>
					<select name="bulk_status">
						<option value=""><?php echo esc_html__( '— No Change —', 'nobat' ); ?></option>
						<?php foreach ( $this->bulk_statuses as $status ) : ?>
							<option value="<?php echo esc_attr( $status ); ?>"><?php echo esc_html( $this->get_status_label( $status ) ); ?></option>
						<?php endforeach; ?>
					</select>
				</label>

				<label>
					<span><?php echo esc_html__( 'Assigned Admin', 'nobat' ); ?></span>
					<select name="bulk_assigned_admin">
						<option value=""><?php echo esc_html__( '— No Change —', 'nobat' ); ?></option>
						<option value="0"><?php echo esc_html__( '— None —', 'nobat' ); ?></option>
						<?php foreach ( $admins as $admin ) : ?>
							<option value="<?php echo esc_attr( $admin->ID ); ?>"><?php echo esc_html( $admin->display_name ); ?></option>
						<?php endforeach; ?>
					</select>
				</label>
			</div>

			<p class="submit">
				<button type="submit" class="button button-primary"><?php echo esc_html__( 'Update', 'nobat' ); ?></button>
				<button type="button" class="button" id="nobat-bulk-edit-cancel"><?php echo esc_html__( 'Cancel', 'nobat' ); ?></button>
			</p>
		</form>
		<?php
	}

	/**
	 * Human-readable status label
	 *
	 * @param string $status
	 * @return string
	 */
	private function get_status_label( $status ) {
		$labels = array(
			'pending'          => __( 'Pending', 'nobat' ),
			'confirmed'        => __( 'Confirmed', 'nobat' ),
			'completed'        => __( 'Completed', 'nobat' ),
			'cancelled'        => __( 'Cancelled', 'nobat' ),
			'cancel_requested' => __( 'Cancel Requested', 'nobat' ),
		);

		return isset( $labels[ $status ] ) ? $labels[ $status ] : $status;
	}
}
