<?php
/**
 * Conditional logging helper
 *
 * @package Nobat
 */

namespace Nobat\Utilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Logs messages only when WordPress debug mode is enabled.
 */
class Logger {

	/**
	 * Whether plugin debug logging is enabled.
	 *
	 * @return bool
	 */
	public static function is_debug(): bool {
		return defined( 'WP_DEBUG' ) && WP_DEBUG;
	}

	/**
	 * Write a debug message to the error log when WP_DEBUG is on.
	 *
	 * @param string $message Message to log.
	 * @return void
	 */
	public static function debug( string $message ): void {
		if ( ! self::is_debug() ) {
			return;
		}

		error_log( $message );
	}
}
