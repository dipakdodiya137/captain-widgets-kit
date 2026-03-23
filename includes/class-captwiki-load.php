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

if ( ! class_exists( 'Captwiki_Load' ) ) {

	/**
	 * It is captain-widgets-kit Main Class
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Load {

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

			register_activation_hook( CAPTWIKI_FILE, array( __CLASS__, 'captwiki_activation' ) );
			register_deactivation_hook( CAPTWIKI_FILE, array( __CLASS__, 'captwiki_deactivation' ) );

			add_action( 'plugins_loaded', array( $this, 'captwiki_plugin_loaded' ) );
		}

		/**
		 * Plugin Activation.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public static function captwiki_activation() {}

		/**
		 * Plugin deactivation.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public static function captwiki_deactivation() {}

		/**
		 * Files load plugin loaded.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function captwiki_plugin_loaded() {

			$this->captwiki_load_dependencies();
		}

		/**
		 * Install Elementor Plugin
		 *
		 * @since 1.0.0
		 */
		public function captwiki_elementor_install() {
			$plugin = 'elementor/elementor.php';

			$installed_plugins = get_plugins();

			if ( isset( $installed_plugins[ $plugin ] ) ) {

				if ( ! current_user_can( 'activate_plugins' ) ) {
					return;
				}

				$activation_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=' . $plugin . '&amp;plugin_status=all&amp;paged=1&amp;s', 'activate-plugin_' . $plugin );
				$notice         = '<p>' . esc_html__( 'Elementor is missing. You need to activate your installed Elementor.', 'captain-widgets-kit' ) . '</p>';
				$notice        .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $activation_url, esc_html__( 'Activate Elementor Now', 'captain-widgets-kit' ) ) . '</p>';
			} else {

				if ( ! current_user_can( 'install_plugins' ) ) {
					return;
				}

				$install_url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=elementor' ), 'install-plugin_elementor' );
				$notice      = '<p>' . esc_html__( 'Elementor Required. You need to install & activate.', 'captain-widgets-kit' ) . '</p>';
				$notice     .= '<p>' . sprintf( '<a href="%s" style="background: #085F63;" class="button-primary">%s</a>', $install_url, esc_html__( 'Install Elementor Now', 'captain-widgets-kit' ) ) . '</p>';
			}

			echo '<div class="notice notice-error is-dismissible" style="border-left-color: #085F63;">' . wp_kses_post( $notice ) . '</div>';
		}

		/**
		 * Load the required dependencies for this plugin.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_load_dependencies() {

			include CAPTWIKI_PATH . 'includes/admin/hooks/class-captwiki-hooks.php';
			do_action( 'captwiki_set_settings' );

			include CAPTWIKI_PATH . 'includes/admin/pages/class-captwiki-pages-main.php';

			include CAPTWIKI_PATH . 'includes/patch-load/class-captwiki-patch-load.php';
		}
	}

	Captwiki_Load::get_instance();
}
