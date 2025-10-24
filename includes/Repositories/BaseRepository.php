<?php
/**
 * Base Repository Class
 * 
 * Provides common database operations for all repositories
 * 
 * @package Nobat
 * @since 2.0.0
 */

namespace Nobat\Repositories;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Abstract base repository class
 */
abstract class BaseRepository {
	
	/**
	 * WordPress database object
	 * 
	 * @var wpdb
	 */
	protected $wpdb;
	
	/**
	 * Table name without prefix
	 * 
	 * @var string
	 */
	protected $table;
	
	/**
	 * Full table name with prefix
	 * 
	 * @var string
	 */
	protected $table_name;
	
	/**
	 * Constructor
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
		$this->table_name = $wpdb->prefix . $this->table;
	}
	
	/**
	 * Find a record by ID
	 * 
	 * @param int $id
	 * @return array|null
	 */
	public function find( $id ) {
		$result = $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} WHERE id = %d",
				$id
			),
			ARRAY_A
		);
		
		return $result ?: null;
	}
	
	/**
	 * Find all records
	 * 
	 * @param array $args Query arguments
	 * @return array
	 */
	public function find_all( $args = array() ) {
		$defaults = array(
			'orderby' => 'id',
			'order' => 'DESC',
			'limit' => null,
			'offset' => 0
		);
		
		$args = wp_parse_args( $args, $defaults );
		
		$query = "SELECT * FROM {$this->table_name}";
		
		// Order by
		$query .= " ORDER BY {$args['orderby']} {$args['order']}";
		
		// Limit
		if ( $args['limit'] ) {
			$query .= $this->wpdb->prepare( " LIMIT %d OFFSET %d", $args['limit'], $args['offset'] );
		}
		
		return $this->wpdb->get_results( $query, ARRAY_A );
	}
	
	/**
	 * Insert a new record
	 * 
	 * @param array $data
	 * @return int|false Insert ID on success, false on failure
	 */
	public function insert( $data ) {
		$result = $this->wpdb->insert(
			$this->table_name,
			$data
		);
		
		if ( $result === false ) {
			error_log( 'Repository insert failed: ' . $this->wpdb->last_error );
			return false;
		}
		
		return $this->wpdb->insert_id;
	}
	
	/**
	 * Update a record
	 * 
	 * @param int $id
	 * @param array $data
	 * @return bool
	 */
	public function update( $id, $data ) {
		// Add updated_at if table has it
		if ( $this->has_timestamps() ) {
			$data['updated_at'] = current_time( 'mysql' );
		}
		
		$result = $this->wpdb->update(
			$this->table_name,
			$data,
			array( 'id' => $id ),
			null,
			array( '%d' )
		);
		
		if ( $result === false ) {
			error_log( 'Repository update failed: ' . $this->wpdb->last_error );
			return false;
		}
		
		return true;
	}
	
	/**
	 * Delete a record
	 * 
	 * @param int $id
	 * @return bool
	 */
	public function delete( $id ) {
		$result = $this->wpdb->delete(
			$this->table_name,
			array( 'id' => $id ),
			array( '%d' )
		);
		
		if ( $result === false ) {
			error_log( 'Repository delete failed: ' . $this->wpdb->last_error );
			return false;
		}
		
		return true;
	}
	
	/**
	 * Count records
	 * 
	 * @param array $where Where conditions
	 * @return int
	 */
	public function count( $where = array() ) {
		$query = "SELECT COUNT(*) FROM {$this->table_name}";
		
		if ( ! empty( $where ) ) {
			$query .= $this->build_where_clause( $where );
		}
		
		return (int) $this->wpdb->get_var( $query );
	}
	
	/**
	 * Find records by specific column value
	 * 
	 * @param string $column
	 * @param mixed $value
	 * @param array $args Additional query arguments
	 * @return array
	 */
	public function find_by( $column, $value, $args = array() ) {
		$defaults = array(
			'orderby' => 'id',
			'order' => 'DESC',
			'limit' => null
		);
		
		$args = wp_parse_args( $args, $defaults );
		
		$query = $this->wpdb->prepare(
			"SELECT * FROM {$this->table_name} WHERE {$column} = %s",
			$value
		);
		
		$query .= " ORDER BY {$args['orderby']} {$args['order']}";
		
		if ( $args['limit'] ) {
			$query .= $this->wpdb->prepare( " LIMIT %d", $args['limit'] );
		}
		
		return $this->wpdb->get_results( $query, ARRAY_A );
	}
	
	/**
	 * Find one record by column value
	 * 
	 * @param string $column
	 * @param mixed $value
	 * @return array|null
	 */
	public function find_one_by( $column, $value ) {
		$result = $this->wpdb->get_row(
			$this->wpdb->prepare(
				"SELECT * FROM {$this->table_name} WHERE {$column} = %s LIMIT 1",
				$value
			),
			ARRAY_A
		);
		
		return $result ?: null;
	}
	
	/**
	 * Build WHERE clause from array
	 * 
	 * @param array $where
	 * @return string
	 */
	protected function build_where_clause( $where ) {
		if ( empty( $where ) ) {
			return '';
		}
		
		$conditions = array();
		
		foreach ( $where as $column => $value ) {
			if ( is_array( $value ) ) {
				// IN clause
				$placeholders = implode( ', ', array_fill( 0, count( $value ), '%s' ) );
				$conditions[] = $this->wpdb->prepare(
					"{$column} IN ($placeholders)",
					$value
				);
			} else {
				$conditions[] = $this->wpdb->prepare(
					"{$column} = %s",
					$value
				);
			}
		}
		
		return ' WHERE ' . implode( ' AND ', $conditions );
	}
	
	/**
	 * Check if table has timestamp columns
	 * 
	 * @return bool
	 */
	protected function has_timestamps() {
		return true; // Most tables have timestamps
	}
	
	/**
	 * Get last database error
	 * 
	 * @return string
	 */
	public function get_last_error() {
		return $this->wpdb->last_error;
	}
	
	/**
	 * Begin transaction
	 */
	public function begin_transaction() {
		$this->wpdb->query( 'START TRANSACTION' );
	}
	
	/**
	 * Commit transaction
	 */
	public function commit() {
		$this->wpdb->query( 'COMMIT' );
	}
	
	/**
	 * Rollback transaction
	 */
	public function rollback() {
		$this->wpdb->query( 'ROLLBACK' );
	}
}

