<?php
/**
 * Helper / utility functions used across the plugin
 */

if ( ! defined('ABSPATH') ) {
	exit;
}

/**
 * Return the full-day slot template (includes breaks as rows)
 */
function appointment_booking_get_slot_template() {
	// Build template with excluded flags
	$interval = (int) get_option( 'appointment_booking_slot_interval', 60 );
	$start = (string) get_option( 'appointment_booking_day_start', '09:00' );
	$end = (string) get_option( 'appointment_booking_day_end', '17:00' );
	$breaks_raw = (string) get_option( 'appointment_booking_breaks', '12:00-14:00' );

	$break_ranges = array();
	foreach ( preg_split( '/\r\n|\r|\n/', $breaks_raw ) as $line ) {
		$line = trim( $line );
		if ( $line === '' ) { continue; }
		list( $bStart, $bEnd ) = array_map( 'trim', explode( '-', $line ) );
		$break_ranges[] = array( $bStart, $bEnd );
	}

	$template = array();
	$cursor = appointment_booking_time_to_minutes( $start );
	$end_minutes = appointment_booking_time_to_minutes( $end );
	while ( $cursor + $interval <= $end_minutes ) {
		$slot_start = $cursor;
		$slot_end = $cursor + $interval;
		$label = appointment_booking_minutes_to_time( $slot_start ) . '-' . appointment_booking_minutes_to_time( $slot_end );
		$in_break = false;
		foreach ( $break_ranges as $br ) {
			list( $bs, $be ) = $br;
			$bs_m = appointment_booking_time_to_minutes( $bs );
			$be_m = appointment_booking_time_to_minutes( $be );
			if ( $slot_start < $be_m && $slot_end > $bs_m ) {
				$in_break = true;
				break;
			}
		}
		$template[] = array(
			'label' => $label,
			'excluded' => $in_break,
		);
		$cursor += $interval;
	}

	return new WP_REST_Response( $template, 200 );
}

/**
 * Generate time slots from settings.
 *
 * @param bool $include_breaks If true, includes slots within breaks (for calendar layout). If false, excludes them (for availability).
 * @return array List of slot strings like "09:00-10:00".
 */
function appointment_booking_generate_slots_from_settings( $include_breaks = false ) {
	$interval = (int) get_option( 'appointment_booking_slot_interval', 60 );
	$start = (string) get_option( 'appointment_booking_day_start', '09:00' );
	$end = (string) get_option( 'appointment_booking_day_end', '17:00' );
	$breaks_raw = (string) get_option( 'appointment_booking_breaks', '12:00-14:00' );

	$break_ranges = array();
	foreach ( preg_split( '/\r\n|\r|\n/', $breaks_raw ) as $line ) {
		$line = trim( $line );
		if ( $line === '' ) { continue; }
		list( $bStart, $bEnd ) = array_map( 'trim', explode( '-', $line ) );
		$break_ranges[] = array( $bStart, $bEnd );
	}

	$slots = array();
	$cursor = appointment_booking_time_to_minutes( $start );
	$end_minutes = appointment_booking_time_to_minutes( $end );
	while ( $cursor + $interval <= $end_minutes ) {
		$slot_start = $cursor;
		$slot_end = $cursor + $interval;
		$label = appointment_booking_minutes_to_time( $slot_start ) . '-' . appointment_booking_minutes_to_time( $slot_end );
		
		$in_break = false;
		foreach ( $break_ranges as $br ) {
			list( $bs, $be ) = $br;
			$bs_m = appointment_booking_time_to_minutes( $bs );
			$be_m = appointment_booking_time_to_minutes( $be );
			if ( $slot_start < $be_m && $slot_end > $bs_m ) {
				$in_break = true;
				break;
			}
		}
		if ( $include_breaks || ! $in_break ) {
			$slots[] = $label;
		}
		$cursor += $interval;
	}
	return $slots;
}

function appointment_booking_time_to_minutes( $hhmm ) {
	list( $h, $m ) = array_map( 'intval', explode( ':', $hhmm ) );
	return $h * 60 + $m;
}

function appointment_booking_minutes_to_time( $minutes ) {
	$h = floor( $minutes / 60 );
	$m = $minutes % 60;
	return sprintf( '%02d:%02d', $h, $m );
}

/**
 * Add shortcode for booking form
 */
function appointment_booking_shortcode( $atts ) {
	$atts = shortcode_atts( array(
		'title' => 'Book an Appointment',
	), $atts );
	
	ob_start();
	?>
	<div id="appointment-booking-form">
		<h3><?php echo esc_html( $atts['title'] ); ?></h3>
		<div class="appointment-loading">Loading booking form...</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'appointment_booking', 'appointment_booking_shortcode' );

/**
 * Sanitize time in HH:MM (24h)
 */
function appointment_booking_sanitize_time_hhmm( $time ) {
	$time = (string) $time;
	if ( preg_match( '/^([01]?\d|2[0-3]):[0-5]\d$/', $time ) ) {
		return $time;
	}
	return '09:00';
}
