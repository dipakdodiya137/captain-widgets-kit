<?php
/**
 * Cwk Dashboard Ajax
 *
 * @package   captain-widgets-kit
 **/

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Cwk_Pages_Main
 * */
if ( ! class_exists( 'Cwk_Pages_Main' ) ) {

	/**
	 * Cwk_Pages_Main
	 *
	 * @since 1.0.0
	 */
	class Cwk_Pages_Main {

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
			$this->cwk_pages_load();
		}

		/**
		 * Load the required dependencies for this plugin.
		 *
		 * @since 1.0.0
		 */
		public function cwk_pages_load() {

			include CWK_PATH . 'includes/admin/pages/class-cwk-pages-utils.php';
			include CWK_PATH . 'includes/admin/wp-menu/class-cwk-menu.php';
			include CWK_PATH . 'includes/admin/pages/class-cwk-dashboard-ajax.php';
		}
	}

	Cwk_Pages_Main::get_instance();
}
