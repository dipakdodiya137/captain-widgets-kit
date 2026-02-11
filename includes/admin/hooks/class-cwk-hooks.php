<?php
/**
 * The file that defines the core plugin class
 *
 * @since      1.0.0
 *
 * @package    craftpaaddons
 * @subpackage craftpaaddons/includes
 */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Cwk_Hooks
 * */
if ( ! class_exists( 'Cwk_Hooks' ) ) {

	/**
	 * Cwk_Hooks
	 *
	 * @since 1.0.0
	 */
	class Cwk_Hooks {

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance;

		/**
		 *  Initiator
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Define the core functionality of the plugin.
		 */
		public function __construct() {
			add_action( 'cwk_set_settings', array( $this, 'cwk_set_settings' ), 10 );
		}

		/**
		 * Create Default setting data in db
		 *
		 * @since 1.0.0
		 */
		public function cwk_set_settings() {

			$cwk_settings = get_option( 'cwk_settings', false );
			if ( empty( $cwk_settings ) ) {
				$settings_options = array(
					'cwk_theme'  => 'default',
					'cleanup_db' => false,
					'storage'    => 'files',
				);

				add_option( 'cwk_settings', $settings_options );
			}
		}
	}

	Cwk_Hooks::get_instance();
}
