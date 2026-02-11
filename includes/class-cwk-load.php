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

if ( ! class_exists( 'Cwk_Load' ) ) {

	/**
	 * It is captain-widgets-kit Main Class
	 *
	 * @since 1.0.0
	 */
	class Cwk_Load {

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

			register_activation_hook( CWK_FILE, array( __CLASS__, 'cwk_activation' ) );
			register_deactivation_hook( CWK_FILE, array( __CLASS__, 'cwk_deactivation' ) );

			add_action( 'init', array( $this, 'cwk_i18n' ) );
			add_action( 'plugins_loaded', array( $this, 'cwk_plugin_loaded' ) );
		}

		/**
		 * Plugin Activation.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public static function cwk_activation() {}

		/**
		 * Plugin deactivation.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public static function cwk_deactivation() {}

		/**
		 * Load Text Domain.
		 * Text Domain : captain-widgets-kit
		 *
		 * @since 1.0.0
		 */
		public function cwk_i18n() {
			load_plugin_textdomain( 'captain-widgets-kit' );
		}

		/**
		 * Files load plugin loaded.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function cwk_plugin_loaded() {

			$this->cwk_load_dependencies();
		}

		/**
		 * Install Elementor Plugin
		 *
		 * @since 1.0.0
		 */
		public function cwk_elementor_install() {
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
		public function cwk_load_dependencies() {

			include CWK_PATH . 'includes/admin/hooks/class-cwk-hooks.php';
			do_action( 'cwk_set_settings' );

			include CWK_PATH . 'includes/admin/pages/class-cwk-pages-main.php';

			include CWK_PATH . 'includes/patch-load/class-cwk-patch-load.php';
		}
	}

	Cwk_Load::get_instance();
}
