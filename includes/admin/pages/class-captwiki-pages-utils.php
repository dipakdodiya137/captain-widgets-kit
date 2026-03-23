<?php
/**
 * The file that defines the core plugin class
 *
 * @since      1.0.0
 *
 * @package    captain-widgets-kit
 * @subpackage captain-widgets-kit/includes
 **/

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Captwiki_Pages_Utils
 * */
if ( ! class_exists( 'Captwiki_Pages_Utils' ) ) {

	/**
	 * Captwiki_Pages_Utils
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Pages_Utils {

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance;

		/**
		 * Member Variable
		 *
		 * @var global_setting
		 */
		public $global_setting = array();

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
		 *
		 * @since 1.0.0
		 */
		public function __construct() {
		}

		/**
		 * Captwiki Set Response
		 *
		 * @since 1.0.0
		 * @param bool   $success    Success.
		 * @param string $message    Message.
		 * @param string $description Description.
		 * @param mixed  $data       Data.
		 * @return array
		 */
		public function captwiki_set_response( $success = false, $message = '', $description = '', $data = '' ) {
			return array(
				'success'     => $success,
				'message'     => esc_html( $message ),
				'description' => esc_html( $description ),
				'data'        => $data,
			);
		}
	}

	Captwiki_Pages_Utils::get_instance();
}
