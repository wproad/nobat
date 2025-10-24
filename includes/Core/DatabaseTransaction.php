<?php
/**
 * Database Transaction Handler
 * 
 * Provides transaction support for atomic database operations
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Database Transaction class
 */
class DatabaseTransaction {
	
	/**
	 * WordPress database object
	 * 
	 * @var wpdb
	 */
	private $wpdb;
	
	/**
	 * Transaction nesting level
	 * 
	 * @var int
	 */
	private $transaction_level = 0;
	
	/**
	 * Constructor
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
	}
	
	/**
	 * Begin a transaction
	 * 
	 * @return bool
	 */
	public function begin() {
		if ( $this->transaction_level === 0 ) {
			$result = $this->wpdb->query( 'START TRANSACTION' );
			
			if ( $result === false ) {
				error_log( 'Failed to start transaction: ' . $this->wpdb->last_error );
				return false;
			}
		}
		
		$this->transaction_level++;
		return true;
	}
	
	/**
	 * Commit the transaction
	 * 
	 * @return bool
	 */
	public function commit() {
		if ( $this->transaction_level === 0 ) {
			error_log( 'Cannot commit - no transaction in progress' );
			return false;
		}
		
		$this->transaction_level--;
		
		if ( $this->transaction_level === 0 ) {
			$result = $this->wpdb->query( 'COMMIT' );
			
			if ( $result === false ) {
				error_log( 'Failed to commit transaction: ' . $this->wpdb->last_error );
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * Rollback the transaction
	 * 
	 * @return bool
	 */
	public function rollback() {
		if ( $this->transaction_level === 0 ) {
			error_log( 'Cannot rollback - no transaction in progress' );
			return false;
		}
		
		$this->transaction_level = 0;
		
		$result = $this->wpdb->query( 'ROLLBACK' );
		
		if ( $result === false ) {
			error_log( 'Failed to rollback transaction: ' . $this->wpdb->last_error );
			return false;
		}
		
		return true;
	}
	
	/**
	 * Execute a callback within a transaction
	 * 
	 * Automatically handles commit on success and rollback on failure
	 * 
	 * @param callable $callback Function to execute
	 * @return mixed Result from callback
	 * @throws Exception If callback fails
	 */
	public function execute( callable $callback ) {
		$this->begin();
		
		try {
			$result = $callback();
			$this->commit();
			return $result;
			
		} catch ( Exception $e ) {
			$this->rollback();
			throw $e;
		}
	}
	
	/**
	 * Execute a callback within a transaction with error handling
	 * 
	 * Returns array with success status and result/error
	 * 
	 * @param callable $callback Function to execute
	 * @return array ['success' => bool, 'result' => mixed|null, 'error' => string|null]
	 */
	public function execute_safe( callable $callback ) {
		$this->begin();
		
		try {
			$result = $callback();
			$this->commit();
			
			return array(
				'success' => true,
				'result' => $result,
				'error' => null
			);
			
		} catch ( Exception $e ) {
			$this->rollback();
			
			return array(
				'success' => false,
				'result' => null,
				'error' => $e->getMessage()
			);
		}
	}
	
	/**
	 * Get current transaction level
	 * 
	 * @return int
	 */
	public function get_level() {
		return $this->transaction_level;
	}
	
	/**
	 * Check if transaction is in progress
	 * 
	 * @return bool
	 */
	public function in_transaction() {
		return $this->transaction_level > 0;
	}
}

