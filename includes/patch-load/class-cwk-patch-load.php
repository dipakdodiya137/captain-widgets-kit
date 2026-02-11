<?php
/**
 * Cwk Patch Load
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
 * Cwk_Patch_Load
 * */
if ( ! class_exists( 'Cwk_Patch_Load' ) ) {

	/**
	 * Cwk_Patch_Load
	 *
	 * @since 1.0.0
	 */
	class Cwk_Patch_Load {

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
			$this->cwk_elementor_load();
		}

		/**
		 * This function is called to load Elementor files.
		 *
		 * @since 1.0.0
		 */
		public function cwk_elementor_load() {

			include CWK_PATH . 'includes/patch-load/elementor/class-cwk-elementor-load.php';
		}
	}

	Cwk_Patch_Load::get_instance();
}
