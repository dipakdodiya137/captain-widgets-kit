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
 * Captwiki_Hooks
 * */
if ( ! class_exists( 'Captwiki_Hooks' ) ) {

	/**
	 * Captwiki_Hooks
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Hooks {

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
			add_action( 'captwiki_set_settings', array( $this, 'captwiki_set_settings' ), 10 );
		}

		/**
		 * Create Default setting data in db
		 *
		 * @since 1.0.0
		 */
		public function captwiki_set_settings() {

			$captwiki_settings = get_option( 'captwiki_settings', false );
			if ( empty( $captwiki_settings ) ) {
				$settings_options = array(
					'captwiki_theme' => 'default',
					'cleanup_db'     => false,
					'storage'        => 'files',
				);

				add_option( 'captwiki_settings', $settings_options );
			}
		}
	}

	Captwiki_Hooks::get_instance();
}
