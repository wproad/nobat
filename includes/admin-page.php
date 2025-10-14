<?php
/**
 * Admin page rendering functions
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Handle appointment deletions early, before any output
 */
function appointment_booking_handle_appointment_deletions() {
	// Only run on our appointments page
	if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'appointment-booking' ) {
		return;
	}

	global $wpdb;
	$table = $wpdb->prefix . 'appointments';

	// Handle single delete
	if ( isset( $_GET['action'] ) && $_GET['action'] === 'delete' && isset( $_GET['id'] ) ) {
		$id = intval( $_GET['id'] );
		check_admin_referer( 'delete_appointment_' . $id );
		
		$wpdb->delete( $table, [ 'id' => $id ], [ '%d' ] );
		
		wp_redirect( add_query_arg( 'deleted', 1, remove_query_arg( [ 'action', 'id', '_wpnonce' ] ) ) );
		exit;
	}

	// Handle bulk delete from top dropdown
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

	// Handle bulk delete from bottom dropdown
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
}
add_action( 'admin_init', 'appointment_booking_handle_appointment_deletions' );

/**
 * Handle schedule deletions early, before any output
 */
function appointment_booking_handle_schedule_deletions() {
	// Only run on our schedules page
	if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'appointment-booking-all-schedules' ) {
		return;
	}

	global $wpdb;
	$table = $wpdb->prefix . 'schedules';

	// Handle single delete
	if ( isset( $_GET['action'] ) && $_GET['action'] === 'delete' && isset( $_GET['id'] ) ) {
		$id = intval( $_GET['id'] );
		check_admin_referer( 'delete_schedule_' . $id );
		
		$wpdb->delete( $table, [ 'id' => $id ], [ '%d' ] );
		
		wp_redirect( add_query_arg( 'deleted', 1, remove_query_arg( [ 'action', 'id', '_wpnonce' ] ) ) );
		exit;
	}

	// Handle bulk delete from top dropdown
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

	// Handle bulk delete from bottom dropdown
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
}
add_action( 'admin_init', 'appointment_booking_handle_schedule_deletions' );

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
				'singular' => __( 'Appointment', 'appointment-booking' ),
				'plural'   => __( 'Appointments', 'appointment-booking' ),
				'ajax'     => false,
			] );
		}

		public function get_columns() {
			return [
				'cb'               => '<input type="checkbox" />',
				'id'               => __( 'ID', 'appointment-booking' ),
				'client_name'      => __( 'Client Name', 'appointment-booking' ),
				'client_phone'     => __( 'Client Phone', 'appointment-booking' ),
				'appointment_date' => __( 'Date', 'appointment-booking' ),
				'time_slot'        => __( 'Time Slot', 'appointment-booking' ),
				'status'           => __( 'Status', 'appointment-booking' ),
				'created_at'       => __( 'Created At', 'appointment-booking' ),
			];
		}

		protected function column_cb( $item ) {
			return sprintf(
				'<input type="checkbox" name="appointment[]" value="%s" />',
				esc_attr( $item['id'] )
			);
		}

		protected function column_client_name( $item ) {
			$edit_link = admin_url( 'admin.php?page=appointment_add_new&action=edit&id=' . intval( $item['id'] ) );
			$actions   = [
				'edit'   => sprintf( '<a href="%s">%s</a>', esc_url( $edit_link ), __( 'Edit', 'appointment-booking' ) ),
				'delete' => sprintf(
					'<a href="%s" onclick="return confirm(\'%s\');">%s</a>',
					wp_nonce_url( admin_url( 'admin.php?page=appointment-booking&action=delete&id=' . intval( $item['id'] ) ), 'delete_appointment_' . intval( $item['id'] ) ),
					esc_js( __( 'Are you sure you want to delete this appointment?', 'appointment-booking' ) ),
					__( 'Delete', 'appointment-booking' )
				),
			];

			return sprintf(
				'<a href="%s"><strong>%s</strong></a> %s',
				esc_url( $edit_link ),
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
				default:
					return '';
			}
		}

		protected function get_bulk_actions() {
			return [ 'delete' => __( 'Delete', 'appointment-booking' ) ];
		}

		public function process_bulk_action() {
			// Bulk actions are now handled in the main callback function
			// This method is kept for compatibility but does nothing
		}

		public function extra_tablenav( $which ) {
			if ( 'top' === $which ) {
				$selected_status = isset( $_GET['status_filter'] ) ? sanitize_text_field( $_GET['status_filter'] ) : '';
				$selected_date   = isset( $_GET['date_filter'] ) ? sanitize_text_field( $_GET['date_filter'] ) : '';

				echo '<div class="alignleft actions">';

				// Status filter
				echo '<select name="status_filter">';
				echo '<option value="">' . esc_html__( 'All Statuses', 'appointment-booking' ) . '</option>';
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
					esc_attr__( 'Select date', 'appointment-booking' )
				);

				submit_button( __( 'Filter' ), '', 'filter_action', false );
				echo '</div>';
			}
		}

		public function prepare_items() {
			global $wpdb;
			$table = $wpdb->prefix . 'appointments';

			$this->process_bulk_action();

			$where = '1=1';
			
			// Status filter
			if ( ! empty( $_GET['status_filter'] ) ) {
				$where .= $wpdb->prepare( ' AND status = %s', sanitize_text_field( $_GET['status_filter'] ) );
			}

			// 🗓️ Date filter
			if ( ! empty( $_GET['date_filter'] ) ) {
				$where .= $wpdb->prepare( ' AND appointment_date = %s', sanitize_text_field( $_GET['date_filter'] ) );
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

	echo '<div class="wrap"><h1 class="wp-heading-inline">All Appointments</h1>';
	echo ' <a href="' . admin_url( 'admin.php?page=appointment_add_new' ) . '" class="page-title-action">Add New</a></h1>';

	if ( isset( $_GET['deleted'] ) ) {
		printf(
			'<div class="updated notice is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d appointments deleted.', 'appointment-booking' ), intval( $_GET['deleted'] ) ) )
		);
	}

	echo '<form method="get">';
	echo '<input type="hidden" name="page" value="appointment-booking" />';

	$table = new Appointment_List_Table();
	$table->prepare_items();
	$table->display();

	echo '</form></div>';
}


function appointment_add_new_page_callback() {
    global $wpdb;
    $table = $wpdb->prefix . 'appointments';

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
            echo '<div class="error notice"><p>' . __( 'Appointment not found.', 'appointment-booking' ) . '</p></div>';
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

            echo '<div class="updated notice"><p>' . __( 'Appointment updated successfully!', 'appointment-booking' ) . '</p></div>';
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

            echo '<div class="updated notice"><p>' . __( 'Appointment added successfully!', 'appointment-booking' ) . '</p></div>';
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
            <?php echo $is_edit ? __( 'Edit Appointment', 'appointment-booking' ) : __( 'Add New Appointment', 'appointment-booking' ); ?>
        </h1>

        <form method="post">
            <table class="form-table">
                <tr>
                    <th><label for="client_name"><?php _e( 'Client Name', 'appointment-booking' ); ?></label></th>
                    <td><input type="text" name="client_name" id="client_name" class="regular-text" required
                        value="<?php echo esc_attr( $appointment['client_name'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="client_phone"><?php _e( 'Client Phone', 'appointment-booking' ); ?></label></th>
                    <td><input type="text" name="client_phone" id="client_phone" class="regular-text" required
                        value="<?php echo esc_attr( $appointment['client_phone'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="appointment_date"><?php _e( 'Appointment Date', 'appointment-booking' ); ?></label></th>
                    <td><input type="date" name="appointment_date" id="appointment_date" required
                        value="<?php echo esc_attr( $appointment['appointment_date'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="time_slot"><?php _e( 'Time Slot', 'appointment-booking' ); ?></label></th>
                    <td><input type="text" name="time_slot" id="time_slot" class="regular-text" required
                        value="<?php echo esc_attr( $appointment['time_slot'] ?? '' ); ?>"></td>
                </tr>

                <tr>
                    <th><label for="status"><?php _e( 'Status', 'appointment-booking' ); ?></label></th>
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

            <?php submit_button( $is_edit ? __( 'Update Appointment', 'appointment-booking' ) : __( 'Save Appointment', 'appointment-booking' ) ); ?>
        </form>
    </div>
    <?php
}


/**
 * Outputs the root element for the calendar React component
 */
function appointment_booking_calendar_page_html() {
	printf(
		'<div class="wrap" id="appointment-booking-calendar">%s</div>',
		esc_html__( 'Loading calendar...', 'appointment-booking' )
	);
}

function appointment_booking_cal_page_html() {
	printf(
		'<div class="wrap" id="appointment-booking-cal">%s</div>',
		esc_html__( 'Loading cal...', 'appointment-booking' )
	);
}



/**
 * Outputs the root element for the scheduling React component
 */
function appointment_booking_scheduling_page_html() {
		printf(
		'<div class="wrap" id="appointment-booking-scheduling">%s</div>',
		esc_html__( 'Loading scheduling...', 'appointment-booking' )
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
				'singular' => __( 'Schedule', 'appointment-booking' ),
				'plural'   => __( 'Schedules', 'appointment-booking' ),
				'ajax'     => false,
			] );
		}

		public function get_columns() {
			return [
				'cb'               => '<input type="checkbox" />',
				'id'               => __( 'ID', 'appointment-booking' ),
				'name'             => __( 'Schedule Name', 'appointment-booking' ),
				'start_day'        => __( 'Start Date', 'appointment-booking' ),
				'end_day'          => __( 'End Date', 'appointment-booking' ),
				'meeting_duration' => __( 'Duration (min)', 'appointment-booking' ),
				'buffer'           => __( 'Buffer (min)', 'appointment-booking' ),
				'is_active'        => __( 'Status', 'appointment-booking' ),
				'created_at'       => __( 'Created At', 'appointment-booking' ),
			];
		}

		protected function column_cb( $item ) {
			return sprintf(
				'<input type="checkbox" name="schedule[]" value="%s" />',
				esc_attr( $item['id'] )
			);
		}

		protected function column_name( $item ) {
			$actions = [
				'delete' => sprintf(
					'<a href="%s" onclick="return confirm(\'%s\');">%s</a>',
					wp_nonce_url( admin_url( 'admin.php?page=appointment-booking-all-schedules&action=delete&id=' . intval( $item['id'] ) ), 'delete_schedule_' . intval( $item['id'] ) ),
					esc_js( __( 'Are you sure you want to delete this schedule?', 'appointment-booking' ) ),
					__( 'Delete', 'appointment-booking' )
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
				case 'start_day':
				case 'end_day':
				case 'meeting_duration':
				case 'buffer':
				case 'created_at':
					return esc_html( $item[ $column_name ] );
				default:
					return '';
			}
		}

		protected function get_bulk_actions() {
			return [ 'delete' => __( 'Delete', 'appointment-booking' ) ];
		}

		public function process_bulk_action() {
			// Bulk actions are now handled in the main callback function
			// This method is kept for compatibility but does nothing
		}

		public function extra_tablenav( $which ) {
			if ( 'top' === $which ) {
				$selected_status = isset( $_GET['status_filter'] ) ? sanitize_text_field( $_GET['status_filter'] ) : '';

				echo '<div class="alignleft actions">';

				// Status filter
				echo '<select name="status_filter">';
				echo '<option value="">' . esc_html__( 'All Statuses', 'appointment-booking' ) . '</option>';
				echo '<option value="1" ' . selected( $selected_status, '1', false ) . '>' . esc_html__( 'Active', 'appointment-booking' ) . '</option>';
				echo '<option value="0" ' . selected( $selected_status, '0', false ) . '>' . esc_html__( 'Inactive', 'appointment-booking' ) . '</option>';
				echo '</select>';
				
				submit_button( __( 'Filter' ), '', 'filter_action', false );
				echo '</div>';
			}
		}

		public function prepare_items() {
			global $wpdb;
			$table = $wpdb->prefix . 'schedules';

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
					esc_html__( 'Active', 'appointment-booking' )
				);
			} else {
				return sprintf(
					'<span style="background-color:#777; color:#fff; padding:3px 8px; border-radius:6px; font-size:12px;">%s</span>',
					esc_html__( 'Inactive', 'appointment-booking' )
				);
			}
		}

	}

	echo '<div class="wrap"><h1 class="wp-heading-inline">All Schedules</h1>';
	echo ' <a href="' . admin_url( 'admin.php?page=appointment-booking-scheduling' ) . '" class="page-title-action">Add New</a></h1>';

	if ( isset( $_GET['deleted'] ) ) {
		printf(
			'<div class="updated notice is-dismissible"><p>%s</p></div>',
			esc_html( sprintf( __( '%d schedule(s) deleted.', 'appointment-booking' ), intval( $_GET['deleted'] ) ) )
		);
	}

	echo '<form method="get">';
	echo '<input type="hidden" name="page" value="appointment-booking-all-schedules" />';

	$table = new Schedule_List_Table();
	$table->prepare_items();
	$table->display();

	echo '</form></div>';
}
