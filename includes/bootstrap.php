<?php
/**
 * Bootstrap Application
 *
 * Initialize dependency injection container and register all services
 *
 * @package Nobat
 * @since 2.0.0
 */

use Nobat\Core\Container;
use Nobat\Core\DatabaseTransaction;
use Nobat\Repositories\ScheduleRepository;
use Nobat\Repositories\WorkingHoursRepository;
use Nobat\Repositories\SlotRepository;
use Nobat\Repositories\AppointmentRepository;
use Nobat\Repositories\AppointmentHistoryRepository;
use Nobat\Repositories\UserRepository;
use Nobat\Services\AuthService;
use Nobat\Services\ScheduleService;
use Nobat\Services\SlotService;
use Nobat\Services\AppointmentService;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Bootstrap the application and return configured container
 *
 * @return Container
 */
function nobat_bootstrap() {
	$container = new Container();

	// Register Database Transaction
	$container->singleton( 'db_transaction', function() {
		return new DatabaseTransaction();
	} );

	// Register Repositories (all as singletons)
	$container->singleton( 'schedule_repository', function() {
		return new ScheduleRepository();
	} );

	$container->singleton( 'working_hours_repository', function() {
		return new WorkingHoursRepository();
	} );

	$container->singleton( 'slot_repository', function() {
		return new SlotRepository();
	} );

	$container->singleton( 'appointment_repository', function() {
		return new AppointmentRepository();
	} );

	$container->singleton( 'appointment_history_repository', function() {
		return new AppointmentHistoryRepository();
	} );

	$container->singleton( 'user_repository', function() {
		return new UserRepository();
	} );

	// Register Services (all as singletons with dependencies)
	$container->singleton( 'auth_service', function( $c ) {
		return new AuthService(
			$c->resolve( 'user_repository' )
		);
	} );

	$container->singleton( 'schedule_service', function( $c ) {
		return new ScheduleService(
			$c->resolve( 'schedule_repository' ),
			$c->resolve( 'working_hours_repository' ),
			$c->resolve( 'slot_repository' ),
			$c->resolve( 'db_transaction' )
		);
	} );

	$container->singleton( 'slot_service', function( $c ) {
		return new SlotService(
			$c->resolve( 'slot_repository' ),
			$c->resolve( 'appointment_repository' )
		);
	} );

	$container->singleton( 'appointment_service', function( $c ) {
		return new AppointmentService(
			$c->resolve( 'appointment_repository' ),
			$c->resolve( 'slot_repository' ),
			$c->resolve( 'appointment_history_repository' ),
			$c->resolve( 'db_transaction' )
		);
	} );

	// Register Router
	$container->singleton( 'router', function( $c ) {
		return new \Nobat\Core\Router();
	} );

	// Register Shortcode Handler
	$container->singleton( 'shortcode_handler', function( $c ) {
		return new \Nobat\Core\ShortcodeHandler();
	} );

	return $container;
}

/**
 * Get the global container instance
 *
 * @return Container
 */
function nobat_container() {
	static $container = null;

	if ( $container === null ) {
		$container = nobat_bootstrap();
	}

	return $container;
}

/**
 * Helper function to resolve a service from the container
 *
 * @param string $service Service name
 * @return mixed Service instance
 */
function nobat_service( $service ) {
	return nobat_container()->resolve( $service );
}

