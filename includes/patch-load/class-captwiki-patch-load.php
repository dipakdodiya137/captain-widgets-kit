<?php
/**
 * Captwiki Patch Load
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
 * Captwiki_Patch_Load
 * */
if ( ! class_exists( 'Captwiki_Patch_Load' ) ) {

	/**
	 * Captwiki_Patch_Load
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Patch_Load {

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
			$this->captwiki_elementor_load();	
		}

		/**
		 * This function is called to load Elementor files.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_elementor_load() {

			include CAPTWIKI_PATH . 'includes/patch-load/elementor/class-captwiki-elementor-load.php';
		}
	}

	Captwiki_Patch_Load::get_instance();
}
