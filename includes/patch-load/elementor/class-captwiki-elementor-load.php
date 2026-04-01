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
 * Captwiki_Elementor_Load
 * */
if ( ! class_exists( 'Captwiki_Elementor_Load' ) ) {

	/**
	 * Captwiki_Elementor_Load
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Elementor_Load {

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
			add_action( 'elementor/init', array( $this, 'captwiki_init' ) );
			add_action( 'elementor/editor/after_enqueue_scripts', array( $this, 'captwiki_editor_preview_js' ) );
			add_action( 'elementor/editor/after_enqueue_styles', array( $this, 'captwiki_register_styles_editor' ) );
		}

		/**
		 * This function is called to load Elementor files.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_init() {
			$this->captwiki_widget_load();
		}

		/**
		 * Load Elementor Widget Files
		 */
		public function captwiki_widget_load() {
			$base_dir = trailingslashit( CAPTWIKI_UPPATH );

			if ( ! is_dir( $base_dir ) ) {
				return false;
			}

			$folders = scandir( $base_dir );
			$folders = array_diff( $folders, array( '.', '..' ) );

			foreach ( $folders as $folder ) {
				$folder_path = trailingslashit( $base_dir ) . $folder;

				if ( is_dir( $folder_path ) ) {
					$files = scandir( $folder_path );
					$files = array_diff( $files, array( '.', '..' ) );

					foreach ( $files as $file ) {
						if ( strpos( $file, '.php' ) !== false ) {
							include trailingslashit( $folder_path ) . $file;
						}
					}
				}
			}
		}

		/**
		 * Enqueue Editor Preview JS
		 */
		public function captwiki_editor_preview_js() {
			wp_enqueue_script( 'captwiki-editor-preview', CAPTWIKI_URL . '/assets/js/captwiki-editor-preview.js', array( 'jquery', 'elementor-editor' ), CAPTWIKI_VERSION, true );
		}

		/**
		 * Enqueue Editor Preview CSS
		 */
		public function captwiki_register_styles_editor() {
			wp_enqueue_style( 'captwiki-editor-preview-css', CAPTWIKI_URL . 'assets/css/captwiki-editor-preview.css', array( 'elementor-editor' ), CAPTWIKI_VERSION, false );
		}
	}

	Captwiki_Elementor_Load::get_instance();
}
