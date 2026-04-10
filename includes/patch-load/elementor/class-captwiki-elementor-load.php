<?php
/**
 * Captwiki Patch Load
 *
 * @package    captain-widgets-kit
 * @subpackage captain-widgets-kit/includes
 *
 * @since 1.0.0
 **/

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main class to load Elementor Patch Files
 *
 * @since 1.0.0
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
		 *
		 * @since 1.0.0
		 */
		public function captwiki_widget_load() {

			$extensions_map = array(

				'2wr6ht25' => array(
					'folder' => 'animated-border-2wr6ht25',
					'file'   => 'class-captwiki-animated-border-2wr6ht25.php',
					'class'  => 'Captwiki_Animated_Border_2wr6ht25',
				),

				'l3pomo25' => array(
					'folder' => 'animated-border-2-l3pomo25',
					'file'   => 'class-captwiki-animated-border-2-l3pomo25.php',
					'class'  => 'Captwiki_Animated_Border_2_l3pomo25',
				),

				'ouz5fo25' => array(
					'folder' => 'animated-border-3_ouz5fo25',
					'file'   => 'class-captwiki-animated-border-3-ouz5fo25.php',
					'class'  => 'Captwiki_Animated_Border_3_ouz5fo25',
				),

				'584igq25' => array(
					'folder' => 'animated-border-4-584igq25',
					'file'   => 'class-captwiki-animated-border-4-584igq25.php',
					'class'  => 'Captwiki_Animated_Border_4_584igq25',
				),

				'3eelll25' => array(
					'folder' => 'b-u-t-t-o-n_3eelll25',
					'file'   => 'class-captwiki-b-u-t-t-o-n-3eelll25.php',
					'class'  => 'Captwiki_Button_3eelll25',
				),

				'fdfsj725' => array(
					'folder' => 'container-morph-fdfsj725',
					'file'   => 'class-captwiki-container-morph-fdfsj725.php',
					'class'  => 'Captwiki_Container_Morph_fdfsj725',
				),

				'mi9yvq26' => array(
					'folder' => 'el-preview-reload-mi9yvq26',
					'file'   => 'class-captwiki-preview-reload-mi9yvq26.php',
					'class'  => 'Captwiki_Preview_Reload_mi9yvq26',
				),

				'bri1yx26' => array(
					'folder' => 'fancy-text-settings-bri1yx26',
					'file'   => 'class-captwiki-fancy-text-settings-bri1yx26.php',
					'class'  => 'Captwiki_Fancy_Text_Settings_bri1yx26',
				),

				'muyei426' => array(
					'folder' => 'ha-card-settings-muyei426',
					'file'   => 'class-captwiki-card-settings-muyei426.php',
					'class'  => 'Captwiki_Card_Settings_muyei426',
				),

				'y5j1q126' => array(
					'folder' => 'ha-infobox-y5j1q126',
					'file'   => 'class-captwiki-info-box-settings-y5j1q126.php',
					'class'  => 'Captwiki_Info_Box_Settings_y5j1q126',
				),

				'mz4j6525' => array(
					'folder' => 'image-morph_mz4j6525',
					'file'   => 'class-captwiki-image-morph-mz4j6525.php',
					'class'  => 'Captwiki_Image_Morph_mz4j6525',
				),
			);

			$captwiki_settings = get_option( 'captwiki_settings', array() );
			$browse_extensions = ! empty( $captwiki_settings['browse_extensions'] ) ? $captwiki_settings['browse_extensions'] : array();

			foreach ( $browse_extensions as $extension_id ) {

				if ( isset( $extensions_map[ $extension_id ] ) ) {

					$ext = $extensions_map[ $extension_id ];

					$file_path = CAPTWIKI_PATH . 'includes/patch-load/patchs/' . $ext['folder'] . '/' . $ext['file'];

					if ( file_exists( $file_path ) ) {
						require_once $file_path;
					}
				}
			}
		}

		/**
		 * Enqueue Editor Preview JS
		 *
		 * @since 1.0.0
		 */
		public function captwiki_editor_preview_js() {
			wp_enqueue_script( 'captwiki-editor-preview', CAPTWIKI_URL . '/assets/js/captwiki-editor-preview.js', array( 'jquery', 'elementor-editor' ), CAPTWIKI_VERSION, true );
		}

		/**
		 * Enqueue Editor Preview CSS
		 *
		 * @since 1.0.0
		 */
		public function captwiki_register_styles_editor() {
			wp_enqueue_style( 'captwiki-editor-preview-css', CAPTWIKI_URL . 'assets/css/captwiki-editor-preview.css', array( 'elementor-editor' ), CAPTWIKI_VERSION, false );
		}
	}

	Captwiki_Elementor_Load::get_instance();
}
