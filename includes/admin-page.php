<?php
/**
 * Admin page rendering functions
 *
 * @package Nobat
 */

use Nobat\Admin\AppointmentsListTable;
use Nobat\Admin\ScheduleListTable;

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Redirect back to the appointments list, keeping current filters.
 *
 * @param array $args Query args to add (false values are omitted).
 */
function nobat_appointments_redirect( $args = array() ) {
	$filters = array();
	foreach ( array( 'status_filter', 'date_filter', 'admin_filter', 'calendar_filter', 'paged' ) as $key ) {
		if ( ! empty( $_REQUEST[ $key ] ) ) {
			$filters[ $key ] = sanitize_text_field( wp_unslash( $_REQUEST[ $key ] ) );
		}
	}

	wp_safe_redirect(
		add_query_arg(
			array_filter( array_merge( $filters, $args ) ),
			admin_url( 'admin.php?page=nobat-appointments' )
		)
	);
	exit;
}

/**
 * Handle appointment delete and bulk edit before any output
 */
function nobat_handle_appointment_actions() {
	$page = isset( $_REQUEST['page'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['page'] ) ) : '';
	if ( $page !== 'nobat-appointments' ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$appointment_service = nobat_service( 'appointment_service' );
	$admin_id            = get_current_user_id();

	// Single row delete
	if ( isset( $_GET['action'], $_GET['id'] ) && $_GET['action'] === 'delete' && empty( $_REQUEST['appointment'] ) ) {
		$id = intval( $_GET['id'] );
		check_admin_referer( 'delete_appointment_' . $id );

		$result = $appointment_service->cancel_appointment( $id, $admin_id, __( 'Deleted by admin', 'nobat' ) );

		if ( is_wp_error( $result ) ) {
			nobat_appointments_redirect( array( 'error' => $result->get_error_message() ) );
		}

		nobat_appointments_redirect( array( 'deleted' => 1 ) );
	}

	// Bulk delete from list-table dropdowns
	$bulk_action = '';
	if ( isset( $_REQUEST['action'] ) && $_REQUEST['action'] !== '-1' && $_REQUEST['action'] !== 'edit' ) {
		$bulk_action = sanitize_text_field( wp_unslash( $_REQUEST['action'] ) );
	} elseif ( isset( $_REQUEST['action2'] ) && $_REQUEST['action2'] !== '-1' && $_REQUEST['action2'] !== 'edit' ) {
		$bulk_action = sanitize_text_field( wp_unslash( $_REQUEST['action2'] ) );
	}

	if ( $bulk_action === 'delete' && ! empty( $_REQUEST['appointment'] ) ) {
		check_admin_referer( 'bulk-appointments' );

		$ids     = array_map( 'intval', (array) $_REQUEST['appointment'] );
		$deleted = 0;
		$failed  = 0;

		foreach ( $ids as $id ) {
			if ( ! $id ) {
				continue;
			}
			$result = $appointment_service->cancel_appointment( $id, $admin_id, __( 'Deleted by admin', 'nobat' ) );
			if ( is_wp_error( $result ) ) {
				$failed++;
			} else {
				$deleted++;
			}
		}

		nobat_appointments_redirect( array(
			'deleted'       => $deleted,
			'delete_failed' => $failed ? $failed : false,
		) );
	}

	// Bulk edit form
	if ( isset( $_POST['nobat_bulk_edit'] ) ) {
		check_admin_referer( 'nobat_bulk_edit_appointments' );

		$ids = isset( $_POST['appointment'] ) ? array_map( 'intval', (array) $_POST['appointment'] ) : array();
		$ids = array_filter( $ids );

		if ( empty( $ids ) ) {
			nobat_appointments_redirect( array( 'error' => __( 'Please select one or more appointments.', 'nobat' ) ) );
		}

		$changes = array();
		if ( isset( $_POST['bulk_status'] ) && $_POST['bulk_status'] !== '' ) {
			$changes['status'] = sanitize_text_field( wp_unslash( $_POST['bulk_status'] ) );
		}
		if ( isset( $_POST['bulk_assigned_admin'] ) && $_POST['bulk_assigned_admin'] !== '' ) {
			$changes['assigned_admin_id'] = intval( $_POST['bulk_assigned_admin'] );
		}

		if ( empty( $changes ) ) {
			nobat_appointments_redirect( array( 'error' => __( 'No bulk changes were selected.', 'nobat' ) ) );
		}

		$result = $appointment_service->bulk_update( $ids, $changes, $admin_id );

		if ( ! empty( $result['errors'] ) ) {
			set_transient( 'nobat_bulk_edit_errors_' . $admin_id, $result['errors'], 60 );
		}

		nobat_appointments_redirect( array(
			'updated' => $result['updated'] ? $result['updated'] : false,
			'failed'  => $result['failed'] ? $result['failed'] : false,
		) );
	}
}
add_action( 'admin_init', 'nobat_handle_appointment_actions' );

/**
 * Handle schedule deletions early, before any output
 */
function nobat_handle_schedule_deletions() {
	// Only run on our schedules page
	if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'nobat-schedules' ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Handle single delete via service (cascades appointments/slots/hours)
	if ( isset( $_GET['action'] ) && $_GET['action'] === 'delete' && isset( $_GET['id'] ) ) {
		$id = intval( $_GET['id'] );
		check_admin_referer( 'delete_schedule_' . $id );

		$schedule_service = nobat_service( 'schedule_service' );
		$result = $schedule_service->delete_schedule( $id );

		$redirect_args = is_wp_error( $result )
			? array( 'delete_error' => 1 )
			: array( 'deleted' => 1 );

		wp_redirect( add_query_arg( $redirect_args, remove_query_arg( array( 'action', 'id', '_wpnonce', 'deleted', 'delete_error' ) ) ) );
		exit;
	}

}
add_action( 'admin_init', 'nobat_handle_schedule_deletions' );

/**
 * Callback for main appointments page
 */

function appointment_list_page_callback() {
	echo '<div class="wrap"><h1 class="wp-heading-inline">' . esc_html__( 'All Appointments', 'nobat' ) . '</h1><hr class="wp-header-end">';

	if ( isset( $_GET['deleted'] ) ) {
		printf(
			'<div class="updated notice is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d appointment(s) deleted.', 'nobat' ), intval( $_GET['deleted'] ) ) )
		);
	}

	if ( isset( $_GET['updated'] ) ) {
		printf(
			'<div class="updated notice is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d appointment(s) updated.', 'nobat' ), intval( $_GET['updated'] ) ) )
		);
	}

	if ( isset( $_GET['failed'] ) ) {
		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d appointment(s) could not be updated. Invalid status transitions are skipped.', 'nobat' ), intval( $_GET['failed'] ) ) )
		);
	}

	if ( isset( $_GET['delete_failed'] ) ) {
		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d appointment(s) could not be deleted.', 'nobat' ), intval( $_GET['delete_failed'] ) ) )
		);
	}

	$bulk_errors = get_transient( 'nobat_bulk_edit_errors_' . get_current_user_id() );
	if ( is_array( $bulk_errors ) && ! empty( $bulk_errors ) ) {
		delete_transient( 'nobat_bulk_edit_errors_' . get_current_user_id() );
		printf(
			'<div class="notice notice-warning is-dismissible"><p>%s</p><ul><li>%s</li></ul></div>',
			esc_html__( 'Some appointments were not updated:', 'nobat' ),
			implode( '</li><li>', array_map( 'esc_html', $bulk_errors ) )
		);
	}

	if ( isset( $_GET['error'] ) ) {
		printf(
			'<div class="error notice is-dismissible"><p>%s</p></div>',
			esc_html( wp_unslash( $_GET['error'] ) )
		);
	}

	$table = new AppointmentsListTable();
	$table->display_bulk_edit_form();

	echo '<form method="get" id="nobat-appointments-filter">';
	echo '<input type="hidden" name="page" value="nobat-appointments" />';

	$table->prepare_items();
	$table->display();

	echo '</form></div>';
}


function appointment_add_new_page_callback() {
    global $wpdb;
			$table = $wpdb->prefix . 'nobat_appointments';

    $is_edit = isset( $_GET['action'] ) && $_GET['action'] === 'edit' && isset( $_GET['id'] );
    $appointment = null;

    // Load existing appointment for editing
    if ( $is_edit ) {
        $appointment_id = intval( $_GET['id'] );
        $appointment = $wpdb->get_row(
            $wpdb->prepare( "SELECT * FROM $table WHERE id = %d", $appointment_id ),
            ARRAY_A
        );

        if ( ! $appointment ) {
            echo '<div class="error notice"><p>' . __( 'Appointment not found.', 'nobat' ) . '</p></div>';
            return;
        }
    }

    // Handle form submission
    if ( isset( $_POST['submit'] ) ) {
        $client_name      = sanitize_text_field( $_POST['client_name'] );
        $client_phone     = sanitize_text_field( $_POST['client_phone'] );
        $appointment_date = sanitize_text_field( $_POST['appointment_date'] );
        $time_slot        = sanitize_text_field( $_POST['time_slot'] );
        $status           = sanitize_text_field( $_POST['status'] );

        if ( $is_edit ) {
            $wpdb->update(
                $table,
                [
                    'client_name'      => $client_name,
                    'client_phone'     => $client_phone,
                    'appointment_date' => $appointment_date,
                    'time_slot'        => $time_slot,
                    'status'           => $status,
                ],
                [ 'id' => $appointment_id ],
                [ '%s', '%s', '%s', '%s', '%s' ],
                [ '%d' ]
            );

            echo '<div class="updated notice"><p>' . __( 'Appointment updated successfully!', 'nobat' ) . '</p></div>';
        } else {
            $wpdb->insert(
                $table,
                [
                    'client_name'      => $client_name,
                    'client_phone'     => $client_phone,
                    'appointment_date' => $appointment_date,
                    'time_slot'        => $time_slot,
                    'status'           => $status,
                ]
            );

            echo '<div class="updated notice"><p>' . __( 'Appointment added successfully!', 'nobat' ) . '</p></div>';
        }

        // Refresh data after save (for edit view)
        if ( $is_edit ) {
            $appointment = $wpdb->get_row(
                $wpdb->prepare( "SELECT * FROM $table WHERE id = %d", $appointment_id ),
                ARRAY_A
            );
        }
    }

    ?>
    <div class="wrap">
        <h1>
            <?php echo $is_edit ? __( 'Edit Appointment', 'nobat' ) : __( 'Add New Appointment', 'nobat' ); ?>
        </h1>

        <form method="post">
            <table class="form-table">
                <tr>
                    <th><label for="client_name"><?php _e( 'Client Name', 'nobat' ); ?></label></th>
                    <td><input type="text" name="client_name" id="client_name" class="regular-text" required
                        value="<?php echo esc_attr( $appointment['client_name'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="client_phone"><?php _e( 'Client Phone', 'nobat' ); ?></label></th>
                    <td><input type="text" name="client_phone" id="client_phone" class="regular-text" required
                        value="<?php echo esc_attr( $appointment['client_phone'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="appointment_date"><?php _e( 'Appointment Date', 'nobat' ); ?></label></th>
                    <td><input type="date" name="appointment_date" id="appointment_date" required
                        value="<?php echo esc_attr( $appointment['appointment_date'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="time_slot"><?php _e( 'Time Slot', 'nobat' ); ?></label></th>
                    <td><input type="text" name="time_slot" id="time_slot" class="regular-text" required
                        value="<?php echo esc_attr( $appointment['time_slot'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="status"><?php _e( 'Status', 'nobat' ); ?></label></th>
                    <td>
                        <select name="status" id="status">
                            <?php
                            $statuses = [ 'pending', 'confirmed', 'cancelled' ];
                            $current_status = $appointment['status'] ?? 'pending';
                            foreach ( $statuses as $status ) {
                                printf(
                                    '<option value="%1$s" %2$s>%3$s</option>',
                                    esc_attr( $status ),
                                    selected( $current_status, $status, false ),
                                    ucfirst( esc_html( $status ) )
                                );
                            }
                            ?>
                        </select>
                    </td>
                </tr>
            </table>

            <?php submit_button( $is_edit ? __( 'Update Appointment', 'nobat' ) : __( 'Save Appointment', 'nobat' ) ); ?>
        </form>
    </div>
    <?php
}


/**
 * Outputs the root element for the calendar React component
 */
function nobat_cal_page_html() {
	printf(
		'<div class="wrap bf-root" id="nobat-cal" dir="rtl">%s</div>',
		esc_html__( 'Loading cal...', 'nobat' )
	);
}



/**
 * Outputs the root element for the scheduling React component
 */
function nobat_scheduling_page_html() {
		printf(
		'<div class="wrap bf-root" id="nobat-scheduling" dir="rtl">%s</div>',
		esc_html__( 'Loading scheduling...', 'nobat' )
	);
}


/**
 * Callback for all schedules page
 */
function schedule_list_page_callback() {
	if ( ! class_exists( 'WP_List_Table' ) ) {
		require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
	}

	class Schedule_List_Table extends WP_List_Table {

		public function __construct() {
			parent::__construct( [
				'singular' => __( 'Schedule', 'nobat' ),
				'plural'   => __( 'Schedules', 'nobat' ),
				'ajax'     => false,
			] );
		}

	public function get_columns() {
		return [
			// 'cb'               => '<input type="checkbox" />',
			'id'               => __( 'ID', 'nobat' ),
			'name'             => __( 'Schedule Name', 'nobat' ),
			'start_date'       => __( 'Start Date', 'nobat' ),
			'end_date'         => __( 'End Date', 'nobat' ),
			'meeting_duration' => __( 'Duration (min)', 'nobat' ),
			// 'buffer_time'      => __( 'Buffer (min)', 'nobat' ),
			'is_active'        => __( 'Status', 'nobat' ),
			'created_at'       => __( 'Created At', 'nobat' ),
		];
	}

		/*
		protected function column_cb( $item ) {
			return sprintf(
				'<input type="checkbox" name="schedule[]" value="%s" />',
				esc_attr( $item['id'] )
			);
		}
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

	protected function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'id':
			case 'start_date':
			case 'end_date':
			case 'meeting_duration':
			// case 'buffer_time':
			case 'created_at':
				return esc_html( $item[ $column_name ] );
			default:
				return '';
		}
	}

		/*
		protected function get_bulk_actions() {
			return [ 'delete' => __( 'Delete', 'nobat' ) ];
		}
		*/

		/*
		public function process_bulk_action() {
			// Bulk actions are now handled in the main callback function
			// This method is kept for compatibility but does nothing
		}
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

	}

	echo '<div class="wrap"><h1 class="wp-heading-inline">' . esc_html__( 'All Schedules', 'nobat' ) . '</h1>';
	echo ' <a href="' . admin_url( 'admin.php?page=nobat-scheduling' ) . '" class="page-title-action">' . esc_html__( 'Add New', 'nobat' ) . '</a></h1>';

	if ( isset( $_GET['deleted'] ) ) {
		printf(
			'<div class="updated notice is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d schedule(s) deleted.', 'nobat' ), intval( $_GET['deleted'] ) ) )
		);
	}

	if ( isset( $_GET['delete_error'] ) ) {
		printf(
			'<div class="notice notice-error is-dismissible"><p>%s</p></div>',
			esc_html__( 'Failed to delete schedule.', 'nobat' )
		);
	}

	if ( isset( $_GET['updated'] ) ) {
		printf(
			'<div class="updated notice is-dismissible"><p>%s</p></div>',
			esc_html__( 'Schedule updated.', 'nobat' )
		);
	}

	echo '<form method="get">';
	echo '<input type="hidden" name="page" value="nobat-schedules" />';

	$table = new ScheduleListTable();
	$table->prepare_items();
	$table->display();

	echo '</form></div>';
}

/**
 * Handle schedule edit form submission
 */
function nobat_handle_schedule_edit() {
	if ( ! isset( $_POST['nobat_edit_schedule'] ) ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$schedule_id = isset( $_POST['schedule_id'] ) ? intval( $_POST['schedule_id'] ) : 0;
	if ( ! $schedule_id ) {
		return;
	}

	check_admin_referer( 'nobat_edit_schedule_' . $schedule_id );

	$was_active = ! empty( $_POST['was_active'] );
	$is_active = ! empty( $_POST['is_active'] );

	if ( $was_active && ! $is_active ) {
		// Extra confirmation flag from the form JS/UI
		if ( empty( $_POST['confirm_deactivate'] ) ) {
			wp_die(
				esc_html__( 'Deactivating this schedule will cancel all open appointments on it. Please confirm and try again.', 'nobat' ),
				esc_html__( 'Confirmation required', 'nobat' ),
				array( 'response' => 400, 'back_link' => true )
			);
		}
	}

	$name = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	if ( $name === '' ) {
		wp_die(
			esc_html__( 'Schedule name is required.', 'nobat' ),
			esc_html__( 'Validation error', 'nobat' ),
			array( 'response' => 400, 'back_link' => true )
		);
	}

	$schedule_service = nobat_service( 'schedule_service' );
	$result = $schedule_service->update_schedule(
		$schedule_id,
		array(
			'name' => $name,
			'is_active' => $is_active ? 1 : 0,
		),
		get_current_user_id()
	);

	if ( is_wp_error( $result ) ) {
		wp_die(
			esc_html( $result->get_error_message() ),
			esc_html__( 'Update failed', 'nobat' ),
			array( 'response' => 500, 'back_link' => true )
		);
	}

	wp_safe_redirect( admin_url( 'admin.php?page=nobat-schedules&updated=1' ) );
	exit;
}
add_action( 'admin_init', 'nobat_handle_schedule_edit' );

/**
 * Edit schedule admin page (name + is_active)
 */
function nobat_schedule_edit_page_html() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$schedule_id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
	$schedule = $schedule_id
		? nobat_service( 'schedule_repository' )->find( $schedule_id )
		: null;

	if ( ! $schedule ) {
		echo '<div class="wrap"><h1>' . esc_html__( 'Edit Schedule', 'nobat' ) . '</h1>';
		echo '<div class="notice notice-error"><p>' . esc_html__( 'Schedule not found.', 'nobat' ) . '</p></div>';
		echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=nobat-schedules' ) ) . '">' . esc_html__( 'Back to Schedules', 'nobat' ) . '</a></p></div>';
		return;
	}

	$is_active = ! empty( $schedule['is_active'] );
	$deactivate_msg = esc_js(
		__( 'Deactivating this schedule will cancel all open appointments on it (pending, confirmed, and cancellation requests). Continue?', 'nobat' )
	);
	?>
	<div class="wrap">
		<h1><?php echo esc_html__( 'Edit Schedule', 'nobat' ); ?></h1>
		<p>
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=nobat-schedules' ) ); ?>">
				<?php echo esc_html__( 'Back to Schedules', 'nobat' ); ?>
			</a>
			|
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=nobat&schedule_id=' . intval( $schedule['id'] ) ) ); ?>">
				<?php echo esc_html__( 'View Calendar', 'nobat' ); ?>
			</a>
		</p>

		<form method="post" id="nobat-edit-schedule-form">
			<?php wp_nonce_field( 'nobat_edit_schedule_' . intval( $schedule['id'] ) ); ?>
			<input type="hidden" name="nobat_edit_schedule" value="1" />
			<input type="hidden" name="schedule_id" value="<?php echo esc_attr( $schedule['id'] ); ?>" />
			<input type="hidden" name="was_active" value="<?php echo $is_active ? '1' : '0'; ?>" />
			<input type="hidden" name="confirm_deactivate" id="nobat-confirm-deactivate" value="" />

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="nobat-schedule-name"><?php echo esc_html__( 'Schedule Name', 'nobat' ); ?></label>
					</th>
					<td>
						<input
							type="text"
							class="regular-text"
							id="nobat-schedule-name"
							name="name"
							value="<?php echo esc_attr( $schedule['name'] ); ?>"
							required
						/>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php echo esc_html__( 'Status', 'nobat' ); ?></th>
					<td>
						<label for="nobat-schedule-active">
							<input
								type="checkbox"
								id="nobat-schedule-active"
								name="is_active"
								value="1"
								<?php checked( $is_active ); ?>
							/>
							<?php echo esc_html__( 'Active', 'nobat' ); ?>
						</label>
						<p class="description">
							<?php echo esc_html__( 'Multiple schedules can be active at the same time. Deactivating cancels open appointments on this schedule.', 'nobat' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php echo esc_html__( 'Date Range', 'nobat' ); ?></th>
					<td>
						<code><?php echo esc_html( $schedule['start_date'] . ' — ' . $schedule['end_date'] ); ?></code>
						<p class="description"><?php echo esc_html__( 'Dates cannot be edited here.', 'nobat' ); ?></p>
					</td>
				</tr>
			</table>

			<?php submit_button( __( 'Save Changes', 'nobat' ) ); ?>
		</form>
	</div>
	<script>
	(function () {
		var form = document.getElementById('nobat-edit-schedule-form');
		if (!form) return;
		var wasActive = <?php echo $is_active ? 'true' : 'false'; ?>;
		var confirmInput = document.getElementById('nobat-confirm-deactivate');
		var activeCheckbox = document.getElementById('nobat-schedule-active');
		var message = '<?php echo $deactivate_msg; ?>';

		form.addEventListener('submit', function (e) {
			var willDeactivate = wasActive && activeCheckbox && !activeCheckbox.checked;
			if (willDeactivate) {
				if (!window.confirm(message)) {
					e.preventDefault();
					return;
				}
				if (confirmInput) {
					confirmInput.value = '1';
				}
			}
		});
	})();
	</script>
	<?php
}

/**
 * Callback for cancellation requests page
 */
// Cancellation requests page removed - now handled in calendar view
