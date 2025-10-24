<?php
/**
 * Simple Dependency Injection Container
 *
 * Manages service instantiation and dependencies
 *
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dependency Injection Container class
 */
class Container {

	/**
	 * Registered services
	 *
	 * @var array
	 */
	private $services = array();

	/**
	 * Singleton instances
	 *
	 * @var array
	 */
	private $singletons = array();

	/**
	 * Register a service resolver
	 *
	 * @param string $name Service name
	 * @param callable $resolver Function that creates the service
	 * @return void
	 */
	public function register( $name, $resolver ) {
		if ( ! is_callable( $resolver ) ) {
			throw new InvalidArgumentException( "Resolver for '{$name}' must be callable" );
		}

		$this->services[ $name ] = $resolver;
	}

	/**
	 * Register a singleton service
	 *
	 * Service will be instantiated once and reused
	 *
	 * @param string $name Service name
	 * @param callable $resolver Function that creates the service
	 * @return void
	 */
	public function singleton( $name, $resolver ) {
		$this->register( $name, $resolver );
		$this->singletons[ $name ] = null;
	}

	/**
	 * Resolve a service from the container
	 *
	 * @param string $name Service name
	 * @return mixed Service instance
	 * @throws Exception If service not registered
	 */
	public function resolve( $name ) {
		if ( ! isset( $this->services[ $name ] ) ) {
			throw new \Exception( "Service '{$name}' not registered in container" );
		}

		// Check if it's a singleton and already instantiated
		if ( array_key_exists( $name, $this->singletons ) ) {
			if ( $this->singletons[ $name ] === null ) {
				// Create singleton instance
				$this->singletons[ $name ] = call_user_func( $this->services[ $name ], $this );
			}
			return $this->singletons[ $name ];
		}

		// Create new instance each time
		return call_user_func( $this->services[ $name ], $this );
	}

	/**
	 * Check if a service is registered
	 *
	 * @param string $name Service name
	 * @return bool
	 */
	public function has( $name ) {
		return isset( $this->services[ $name ] );
	}

	/**
	 * Get all registered service names
	 *
	 * @return array
	 */
	public function get_registered_services() {
		return array_keys( $this->services );
	}

	/**
	 * Clear a singleton instance (useful for testing)
	 *
	 * @param string $name Service name
	 * @return void
	 */
	public function clear_singleton( $name ) {
		if ( array_key_exists( $name, $this->singletons ) ) {
			$this->singletons[ $name ] = null;
		}
	}

	/**
	 * Clear all singleton instances
	 *
	 * @return void
	 */
	public function clear_all_singletons() {
		foreach ( array_keys( $this->singletons ) as $name ) {
			$this->singletons[ $name ] = null;
		}
	}
}

