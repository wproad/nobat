<?php
/**
 * Shortcode Handler
 *
 * Registers and handles all plugin shortcodes.
 *
 * @package Nobat
 * @subpackage Core
 * @since 2.0.0
 */

namespace Nobat\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ShortcodeHandler class
 */
class ShortcodeHandler {

	/**
	 * Register all shortcodes
	 */
	public function register() {
		add_shortcode( 'nobat_booking', array( $this, 'booking_form' ) );
	}

	/**
	 * Booking form shortcode handler
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function booking_form( $atts ) {
		// Parse shortcode attributes
		$atts = shortcode_atts( array(
			'schedule_id' => '',
		), $atts );

		// Enqueue frontend scripts
		$this->enqueue_booking_scripts();

		// Generate unique container ID
		$container_id = 'nobat-booking-' . uniqid();

		ob_start();
		?>
		<div id="<?php echo esc_attr( $container_id ); ?>" class="nobat-booking-container" data-schedule-id="<?php echo esc_attr( $atts['schedule_id'] ); ?>">
			<div class="nobat-booking-wrapper">
				<div class="nobat-booking-app"></div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Enqueue booking form scripts and styles
	 */
	private function enqueue_booking_scripts() {
		// Enqueue booking styles
		wp_enqueue_style(
			'nobat-booking',
			NOBAT_PLUGIN_URL . 'build/booking.css',
			array(),
			NOBAT_VERSION
		);

		// Enqueue booking script
		$asset_file = NOBAT_PLUGIN_DIR . 'build/booking.asset.php';
		$asset = file_exists( $asset_file )
			? include $asset_file
			: array( 'dependencies' => array(), 'version' => NOBAT_VERSION );

		wp_enqueue_script(
			'nobat-booking',
			NOBAT_PLUGIN_URL . 'build/booking.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Localize script with API data
		wp_localize_script(
			'nobat-booking',
			'nobatBooking',
			array(
				'apiUrl' => rest_url( 'nobat/v2' ),
				'nonce' => wp_create_nonce( 'wp_rest' ),
				'isLoggedIn' => is_user_logged_in(),
				'currentUser' => $this->get_current_user_data(),
				'successMessage' => get_option( 'nobat_success_message', '' ),
				'strings' => array(
					'loginRequired' => __( 'You must be logged in to book an appointment.', 'nobat' ),
					'loginLink' => wp_login_url( get_permalink() ),
					'loading' => __( 'Loading...', 'nobat' ),
					'error' => __( 'An error occurred. Please try again.', 'nobat' ),
				),
			)
		);
	}

	/**
	 * Get current user data for frontend
	 *
	 * @return array User data.
	 */
	private function get_current_user_data() {
		if ( ! is_user_logged_in() ) {
			return array(
				'id' => 0,
				'name' => '',
				'email' => '',
			);
		}

		$current_user = wp_get_current_user();

		return array(
			'id' => $current_user->ID,
			'name' => $current_user->display_name,
			'email' => $current_user->user_email,
		);
	}
}

