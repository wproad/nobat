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

		// Add additional localization data for this shortcode instance
		// Note: The script is already enqueued by enqueue-scripts.php
		$this->localize_booking_data();

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
	 * Add localization data for booking form
	 * The script itself is enqueued by enqueue-scripts.php
	 */
	private function localize_booking_data() {
		// Only localize if not already done
		static $localized = false;
		if ( $localized ) {
			return;
		}
		$localized = true;

		// Add additional booking-specific data
		wp_localize_script(
			'nobat-frontend-script', // Use the same handle as in enqueue-scripts.php
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

