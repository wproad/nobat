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
 * Handle appointment deletions early, before any output
 */
function nobat_handle_appointment_deletions() {
	// Only run on our appointments page
	if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'nobat-appointments' ) {
		return;
	}

	// Handle single delete
	if ( isset( $_GET['action'] ) && $_GET['action'] === 'delete' && isset( $_GET['id'] ) ) {
		$id = intval( $_GET['id'] );
		check_admin_referer( 'delete_appointment_' . $id );
		
		// Use the service layer to properly cancel the appointment
		// This ensures the slot status is updated to "available"
		$appointment_service = nobat_service( 'appointment_service' );
		$admin_id = get_current_user_id();
		$result = $appointment_service->cancel_appointment( $id, $admin_id, __( 'Deleted by admin', 'nobat' ) );
		
		if ( is_wp_error( $result ) ) {
			wp_redirect( add_query_arg( 'error', urlencode( $result->get_error_message() ), remove_query_arg( [ 'action', 'id', '_wpnonce' ] ) ) );
		} else {
			wp_redirect( add_query_arg( 'deleted', 1, remove_query_arg( [ 'action', 'id', '_wpnonce' ] ) ) );
		}
		exit;
	}

	// Handle bulk delete from top dropdown
	/*
	if ( isset( $_REQUEST['action'] ) && $_REQUEST['action'] === 'delete' && isset( $_REQUEST['appointment'] ) ) {
		check_admin_referer( 'bulk-appointments' );
		
		$ids = array_map( 'intval', (array) $_REQUEST['appointment'] );
		
		if ( ! empty( $ids ) ) {
			$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE id IN ($placeholders)", $ids ) );
			
			wp_redirect( add_query_arg( 'deleted', count( $ids ), remove_query_arg( [ 'action', 'action2', 'appointment', '_wpnonce' ] ) ) );
			exit;
		}
	}
	*/

	// Handle bulk delete from bottom dropdown
	/*
	if ( isset( $_REQUEST['action2'] ) && $_REQUEST['action2'] === 'delete' && isset( $_REQUEST['appointment'] ) ) {
		check_admin_referer( 'bulk-appointments' );
		
		$ids = array_map( 'intval', (array) $_REQUEST['appointment'] );
		
		if ( ! empty( $ids ) ) {
			$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE id IN ($placeholders)", $ids ) );
			
			wp_redirect( add_query_arg( 'deleted', count( $ids ), remove_query_arg( [ 'action', 'action2', 'appointment', '_wpnonce' ] ) ) );
			exit;
		}
	}
	*/
}
add_action( 'admin_init', 'nobat_handle_appointment_deletions' );

/**
 * Handle schedule deletions early, before any output
 */
function nobat_handle_schedule_deletions() {
	// Only run on our schedules page
	if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'nobat-schedules' ) {
		return;
	}

	global $wpdb;
	$table = $wpdb->prefix . 'nobat_schedules';

	// Handle single delete
	if ( isset( $_GET['action'] ) && $_GET['action'] === 'delete' && isset( $_GET['id'] ) ) {
		$id = intval( $_GET['id'] );
		check_admin_referer( 'delete_schedule_' . $id );
		
		$wpdb->delete( $table, [ 'id' => $id ], [ '%d' ] );
		
		wp_redirect( add_query_arg( 'deleted', 1, remove_query_arg( [ 'action', 'id', '_wpnonce' ] ) ) );
		exit;
	}

	// Handle bulk delete from top dropdown
	/*
	if ( isset( $_REQUEST['action'] ) && $_REQUEST['action'] === 'delete' && isset( $_REQUEST['schedule'] ) ) {
		check_admin_referer( 'bulk-schedules' );
		
		$ids = array_map( 'intval', (array) $_REQUEST['schedule'] );
		
		if ( ! empty( $ids ) ) {
			$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE id IN ($placeholders)", $ids ) );
			
			wp_redirect( add_query_arg( 'deleted', count( $ids ), remove_query_arg( [ 'action', 'action2', 'schedule', '_wpnonce' ] ) ) );
			exit;
		}
	}
	*/

	// Handle bulk delete from bottom dropdown
	/*
	if ( isset( $_REQUEST['action2'] ) && $_REQUEST['action2'] === 'delete' && isset( $_REQUEST['schedule'] ) ) {
		check_admin_referer( 'bulk-schedules' );
		
		$ids = array_map( 'intval', (array) $_REQUEST['schedule'] );
		
		if ( ! empty( $ids ) ) {
			$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM $table WHERE id IN ($placeholders)", $ids ) );
			
			wp_redirect( add_query_arg( 'deleted', count( $ids ), remove_query_arg( [ 'action', 'action2', 'schedule', '_wpnonce' ] ) ) );
			exit;
		}
	}
	*/
}
add_action( 'admin_init', 'nobat_handle_schedule_deletions' );

/**
 * Callback for main appointments page
 */

function appointment_list_page_callback() {
	if ( ! class_exists( 'WP_List_Table' ) ) {
		require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
	}

	class Appointment_List_Table extends WP_List_Table {

		private $statuses = [ 'pending', 'confirmed', 'cancelled', 'completed' ];

		public function __construct() {
			parent::__construct( [
				'singular' => __( 'Appointment', 'nobat' ),
				'plural'   => __( 'Appointments', 'nobat' ),
				'ajax'     => false,
			] );
		}

		public function get_columns() {
			return [
				// 'cb'               => '<input type="checkbox" />',
				'id'               => __( 'ID', 'nobat' ),
				'client_name'      => __( 'Client Name', 'nobat' ),
				'client_phone'     => __( 'Client Phone', 'nobat' ),
				'appointment_date' => __( 'Date', 'nobat' ),
				'time_slot'        => __( 'Time Slot', 'nobat' ),
				'status'           => __( 'Status', 'nobat' ),
				'assigned_admin'   => __( 'Assigned Admin', 'nobat' ),
				'cancellation_reason' => __( 'Cancellation Reason', 'nobat' ),
				'created_at'       => __( 'Created At', 'nobat' ),
			];
		}

		/*
		protected function column_cb( $item ) {
			return sprintf(
				'<input type="checkbox" name="appointment[]" value="%s" />',
				esc_attr( $item['id'] )
			);
		}
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

		protected function column_default( $item, $column_name ) {
			switch ( $column_name ) {
				case 'id':
				case 'client_phone':
				case 'appointment_date':
				case 'time_slot':
				case 'status':
				case 'created_at':
					return esc_html( $item[ $column_name ] );
				case 'assigned_admin':
					return $item[ $column_name ] ? esc_html( $item[ $column_name ] ) : '<span style="color: #999;">—</span>';
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
				global $wpdb;
				$selected_status = isset( $_GET['status_filter'] ) ? sanitize_text_field( $_GET['status_filter'] ) : '';
				$selected_date   = isset( $_GET['date_filter'] ) ? sanitize_text_field( $_GET['date_filter'] ) : '';
				$selected_admin  = isset( $_GET['admin_filter'] ) ? intval( $_GET['admin_filter'] ) : '';

				echo '<div class="alignleft actions">';

				// Status filter
				echo '<select name="status_filter" style="margin-right: 8px;">';
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

				// Admin filter - get all admins who have appointments
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
							esc_attr( $admin->ID ),
							selected( $selected_admin, $admin->ID, false ),
							esc_html( $admin->display_name )
						);
					}
					echo '</select>';
				}

				// Date filter
				printf(
					'<input type="date" name="date_filter" value="%s" placeholder="%s" style="margin-right: 8px;" />',
					esc_attr( $selected_date ),
					esc_attr__( 'Select date', 'nobat' )
				);

				submit_button( __( 'Filter', 'nobat' ), 'button', 'filter_action', false );
				
				// Clear filters button (only show if filters are applied)
				if ( ! empty( $selected_status ) || ! empty( $selected_date ) || ! empty( $selected_admin ) ) {
					echo ' ';
				printf(
					'<a href="%s" class="button">%s</a>',
					admin_url( 'admin.php?page=nobat-appointments' ),
					esc_html__( 'Clear', 'nobat' )
				);
				}
				
				echo '</div>';
			}
		}

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

			// Admin filter
			if ( ! empty( $_GET['admin_filter'] ) ) {
				$where .= $wpdb->prepare( ' AND a.assigned_admin_id = %d', intval( $_GET['admin_filter'] ) );
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
						a.cancellation_reason,
						u.display_name as client_name,
						COALESCE(um.meta_value, u.user_email) as client_phone,
						admin.display_name as assigned_admin,
						s.slot_date as appointment_date,
						CONCAT(TIME_FORMAT(s.start_time, '%%H:%%i'), '-', TIME_FORMAT(s.end_time, '%%H:%%i')) as time_slot
					FROM $appointments_table a
					LEFT JOIN $users_table u ON a.user_id = u.ID
					LEFT JOIN $slots_table s ON a.slot_id = s.id
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

		public function column_status( $item ) {
			$status = esc_html( $item['status'] );

			// TODO: shared colors in php and js
			$colors = array(
				'pending'   => '#f0ad4e',
				'confirmed' => '#5cb85c',
				'completed' => '#337ab7',
				'cancelled' => '#d9534f',
			);
			$color = isset( $colors[ $status ] ) ? $colors[ $status ] : '#777';

			return sprintf(
				'<span style="background-color:%s; color:#fff; padding:3px 8px; border-radius:6px; font-size:12px; text-transform:capitalize;">%s</span>',
				esc_attr( $color ),
				$status
			);
		}

	}

	echo '<div class="wrap"><h1 class="wp-heading-inline">' . esc_html__( 'All Appointments', 'nobat' ) . '</h1><hr class="wp-header-end">';

	if ( isset( $_GET['deleted'] ) ) {
		printf(
			'<div class="updated notice is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d appointments deleted.', 'nobat' ), intval( $_GET['deleted'] ) ) )
		);
	}

	if ( isset( $_GET['error'] ) ) {
		printf(
			'<div class="error notice is-dismissible"><p>%s</p></div>',
			esc_html( $_GET['error'] )
		);
	}

	echo '<form method="get">';
	echo '<input type="hidden" name="page" value="nobat-appointments" />';

	$table = new Appointment_List_Table();
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
		'<div class="wrap" id="nobat-cal">%s</div>',
		esc_html__( 'Loading cal...', 'nobat' )
	);
}



/**
 * Outputs the root element for the scheduling React component
 */
function nobat_scheduling_page_html() {
		printf(
		'<div class="wrap" id="nobat-scheduling">%s</div>',
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

	echo '<form method="get">';
	echo '<input type="hidden" name="page" value="nobat-schedules" />';

	$table = new ScheduleListTable();
	$table->prepare_items();
	$table->display();

	echo '</form></div>';
}

/**
 * Callback for cancellation requests page
 */
// Cancellation requests page removed - now handled in calendar view
