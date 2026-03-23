<?php
/**
 * The file that defines the core plugin class
 *
 * @since      1.0.0
 *
 * @package    captain-widgets-kit
 * @subpackage captain-widgets-kit/includes
 */

/**
 * Exit if accessed directly.
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Captwiki_Menu' ) ) {

	/**
	 * It is captain-widgets-kit Main Class
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Menu {

		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance;

		/**
		 * Initiator
		 *
		 * @since 1.0.0
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
			add_action( 'admin_menu', array( $this, 'captwiki_admin_menu' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'captwiki_admin_enqueue_scripts' ), 10, 1 );
		}

		/**
		 * Load the required dependencies for this plugin.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_admin_menu() {
			$capability = 'manage_options';

			$setting_name = __( 'Captain Widgets Kit', 'captain-widgets-kit' );
			$setting_logo = CAPTWIKI_URL . 'assets/svg/logo-single-1-white.svg';

			if ( current_user_can( $capability ) ) {
				add_menu_page( $setting_name, $setting_name, 'manage_options', 'captain-widgets-kit', array( $this, 'captwiki_menu_page_template' ), $setting_logo, 69 );
			}
		}

		/**
		 * Plugin Html load Here.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_menu_page_template() {
			echo '<div id="captain-widgets-kit-app"></div>';
		}

		/**
		 * Enqueue admin scripts and styles.
		 *
		 * Loads necessary CSS and JavaScript files for the WordPress admin panel.
		 * Ensures assets are only loaded when required, based on the current admin page.
		 *
		 * @since 1.0.0
		 * @param string $hook The identifier for the current admin page.
		 * @return void
		 */
		public function captwiki_admin_enqueue_scripts( $hook ) {

			wp_enqueue_style( 'captwiki-ad-admin-css', CAPTWIKI_URL . 'assets/css/admin.css', array(), CAPTWIKI_VERSION . time() );

			if ( 'toplevel_page_captain-widgets-kit' === $hook ) {
				$captwiki_settings = get_option( 'captwiki_settings', array() );

				wp_enqueue_style( 'captwiki-ad-style', CAPTWIKI_URL . 'assets/fonts/style.css', array(), CAPTWIKI_VERSION . time() );
				wp_enqueue_style( 'captwiki-font-style', CAPTWIKI_URL . 'build/index.css', array(), CAPTWIKI_VERSION . time() );

				wp_enqueue_script( 'captwiki-ad-script', CAPTWIKI_URL . 'build/index.js', array( 'wp-i18n', 'wp-element', 'wp-components' ), CAPTWIKI_VERSION . time(), true );
				wp_set_script_translations( 'captwiki-ad-script', 'captain-widgets-kit' );
				wp_localize_script(
					'captwiki-ad-script',
					'captwiki_data',
					array(
						'ajax_url'          => admin_url( 'admin-ajax.php' ),
						'captwiki_nonce'    => wp_create_nonce( 'captwiki_nonce' ),
						'captwiki_version'  => CAPTWIKI_VERSION,
						'captwiki_url'      => CAPTWIKI_URL,
						'captwiki_assets'   => CAPTWIKI_ASSETS,
						'home_url'          => esc_url( home_url( '/' ) ),
						'text_domain'       => 'captain-widgets-kit',
						'captwiki_settings' => $captwiki_settings,
					)
				);
			}
		}
	}

	Captwiki_Menu::get_instance();
}
