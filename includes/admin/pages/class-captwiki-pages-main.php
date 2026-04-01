<?php
/**
 * Captwiki Dashboard Ajax
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
 * Captwiki_Pages_Main
 * */
if ( ! class_exists( 'Captwiki_Pages_Main' ) ) {

	/**
	 * Captwiki_Pages_Main
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Pages_Main {

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
			$this->captwiki_pages_load();
		}

		/**
		 * Load the required dependencies for this plugin.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_pages_load() {

			require_once CAPTWIKI_PATH . 'includes/admin/pages/class-captwiki-pages-utils.php';
			require_once CAPTWIKI_PATH . 'includes/admin/wp-menu/class-captwiki-menu.php';
			require_once CAPTWIKI_PATH . 'includes/admin/pages/class-captwiki-dashboard-ajax.php';
		}
	}

	Captwiki_Pages_Main::get_instance();
}
