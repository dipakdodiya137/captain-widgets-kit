<?php
/**
 * Captwiki Dashboard Ajax
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
 * Main class to load Dashboard Ajax Files
 *
 * @since 1.0.0
 * */
if ( ! class_exists( 'Captwiki_Dashboard_Ajax' ) ) {

	/**
	 * Captwiki_Dashboard_Ajax
	 *
	 * @since 1.0.0
	 */
	class Captwiki_Dashboard_Ajax {

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
			add_action( 'wp_ajax_captwiki_dashboard_ajax_call', array( $this, 'captwiki_dashboard_ajax_call' ) );
		}

		/**
		 * Load the required dependencies for this plugin.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_dashboard_ajax_call() {

			if ( ! check_ajax_referer( 'captwiki_nonce', 'nonce', false ) ) {

				$response = $this->captwiki_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );

				wp_send_json( $response );
				wp_die();
			}

			if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
				$response = $this->captwiki_set_response( false, 'Invalid Permission.', 'Something went wrong.' );

				wp_send_json( $response );
				wp_die();
			}

			$type = isset( $_POST['type'] ) ? strtolower( sanitize_text_field( wp_unslash( $_POST['type'] ) ) ) : false;
			if ( ! $type ) {
				$response = $this->captwiki_set_response( false, 'Invalid type.', 'Something went wrong.' );

				wp_send_json( $response );
				wp_die();
			}

			switch ( $type ) {
				case 'captwiki_manage_setting':
					$response = $this->captwiki_manage_setting();
					break;
				case 'save_settings':
					$response = $this->save_settings();
					break;
				case 'get_widget_controls_structure':
					$response = $this->get_widget_controls_structure();
					break;
				case 'check_plugins_status':
					$response = $this->check_plugins_status();
					break;
				case 'plugin_installation':
					$response = $this->plugin_installation();
					break;
				case 'prevent_ajax_redirect':
					$response = $this->prevent_ajax_redirect();
					break;
				default:
			}

			wp_send_json( $response );
			wp_die();
		}

		/**
		 *
		 * It is Use for Check Plugin Dependency of template.
		 *
		 * @since 1.0.0
		 */
		public function check_plugins_status() {
			$plugins       = isset( $_POST['plugins'] ) ? json_decode( sanitize_text_field( wp_unslash( $_POST['plugins'] ) ) ) : array();
			$update_plugin = array();
			$update_theme  = array();

			if ( empty( $plugins ) || ! is_array( $plugins ) ) {
				$this->captwiki_set_response( false, 'No Plugins', 'No Plugins', array() );
			}

			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$all_plugins = get_plugins();
			foreach ( $plugins as $plugin ) {
				$pluginslug = ! empty( $plugin->plugin_slug ) ? sanitize_text_field( wp_unslash( $plugin->plugin_slug ) ) : '';
				$free_pro   = ! empty( $plugin->freepro ) ? sanitize_text_field( wp_unslash( $plugin->freepro ) ) : '0';
				$type       = ! empty( $plugin->type ) ? sanitize_text_field( wp_unslash( $plugin->type ) ) : 'plugin';

				if ( is_null( $pluginslug ) ) {
					$plugin->status  = 'warning';
					$update_plugin[] = $plugin;
					$update_theme[]  = $plugin;

					continue;
				}

				if ( 'plugin' === $type ) {
					if ( ! is_plugin_active( $pluginslug ) ) {
						if ( ! isset( $all_plugins[ $pluginslug ] ) ) {
							if ( isset( $free_pro ) && '1' === $free_pro ) {
								$plugin->status = 'manually';
							} else {
								$plugin->status = 'unavailable';
							}
						} else {
							$plugin->status = 'inactive';
						}

						$update_plugin[] = $plugin;
					} elseif ( is_plugin_active( $pluginslug ) ) {
						$plugin->status  = 'active';
						$update_plugin[] = $plugin;
					}
				} elseif ( 'theme' === $type ) {
					$theme_array       = array_keys( wp_get_themes() );
					$theme_slug        = get_stylesheet();
					$parent_theme_slug = get_template();

					if ( $theme_slug === $plugin->original_slug || $parent_theme_slug === $plugin->original_slug ) {

						$plugin->status = 'active';
					} else {
						$theme_name = $plugin->original_slug;
						if ( ! in_array( $theme_name, $theme_array, true ) ) {
							if ( isset( $free_pro ) && '1' === $free_pro ) {
								$plugin->status = 'manually';
							} else {
								$plugin->status = 'unavailable';
							}
						} else {
							$plugin->status = 'inactive';
						}
					}

					$update_theme[] = $plugin;
				}
			}

			$response = array(
				'plugins' => $update_plugin,
				'theme'   => $update_theme,
			);

			return $this->captwiki_set_response( true, 'Plugins status checked successfully.', 'Plugins status checked successfully.', $response );
		}

		/**
		 * It is Used to Manage Setting Panel Data.
		 *
		 * @since 1.0.0
		 */
		public function captwiki_manage_setting() {
			$setting_data = ! empty( $_POST['setting_data'] ) ? stripslashes( sanitize_text_field( wp_unslash( $_POST['setting_data'] ) ) ) : array();
			$setting_data = json_decode( $setting_data, true );
			update_option( 'captwiki_settings', $setting_data );

			$response = array(
				'data'    => $setting_data,
				'message' => esc_html__( 'Captain Widgets Kit Settings Updated', 'captain-widgets-kit' ),
				'status'  => 'Success',
				'success' => true,
			);

			wp_send_json( $response );
			wp_die();
		}

		/**
		 * Save Settings
		 *
		 * @since 1.0.0
		 */
		public function get_widget_controls_structure() {

			$widget_name = ! empty( $_POST['widget_name'] ) ? sanitize_file_name( wp_unslash( $_POST['widget_name'] ) ) : '';

			$widget_obj = \Elementor\Plugin::$instance->widgets_manager->get_widget_types( $widget_name );
			$controls   = $widget_obj->get_controls();

			$section_controls_by_tab = array();
			foreach ( $controls as $control_name => $control ) {
				if ( isset( $control['type'] ) && 'section' === $control['type'] ) {
					$tab = isset( $control['tab'] ) ? $control['tab'] : 'content';

					if ( ! isset( $section_controls_by_tab[ $tab ] ) ) {
						$section_controls_by_tab[ $tab ] = array();
					}

					$section_controls_by_tab[ $tab ][ $control_name ]               = $control;
					$section_controls_by_tab[ $tab ][ $control_name ]['controller'] = array();
				}
			}

			foreach ( $controls as $control_name => $control ) {
				$tab     = isset( $control['tab'] ) ? $control['tab'] : 'content';
				$section = isset( $control['section'] ) ? $control['section'] : '';

				if ( ! isset( $control['type'] ) || 'section' === $control['type'] ) {
					continue;
				}

				if ( $section && isset( $section_controls_by_tab[ $tab ][ $section ] ) ) {
					$section_controls_by_tab[ $tab ][ $section ]['controller'][ $control_name ] = $control;
				}
			}

			wp_send_json( $section_controls_by_tab );
		}

		/**
		 * Plugin Installation
		 *
		 * @since 1.0.0
		 */
		public function plugin_installation() {

			if ( ! current_user_can( 'install_plugins' ) ) {
				wp_send_json_error(
					array(
						'status'  => 'permission_denied',
						'message' => __( 'You do not have permission to install plugins.', 'captain-widgets-kit' ),
					)
				);
			}

			$path = ! empty( $_POST['path'] ) ? sanitize_text_field( wp_unslash( $_POST['path'] ) ) : '';
			$slug = ! empty( $_POST['slug'] ) ? sanitize_text_field( wp_unslash( $_POST['slug'] ) ) : '';

			require_once ABSPATH . 'wp-admin/includes/plugin.php';
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
			require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

			if ( file_exists( WP_CONTENT_DIR . '/plugins/' . $path ) ) {

				if ( is_plugin_active( $path ) ) {

					$response = array(
						'message' => esc_html__( 'Plugin is already active.', 'captain-widgets-kit' ),
						'status'  => 'already_active',
						'success' => true,
					);

					wp_send_json( $response );
					wp_die();
				}

				$activate = activate_plugin( $path );

				if ( is_wp_error( $activate ) ) {

					$response = array(
						'message' => $activate->get_error_message(),
						'status'  => 'activation_failed',
						'success' => false,
					);

					wp_send_json( $response );
					wp_die();
				}

				$response = array(
					'message' => esc_html__( 'Plugin activated successfully.', 'captain-widgets-kit' ),
					'status'  => 'activated',
					'success' => true,
				);

				wp_send_json( $response );
				wp_die();
			}

			// 2. Plugin not installed → install.
			$plugin_api = plugins_api(
				'plugin_information',
				array(
					'slug'   => $slug,
					'fields' => array(
						'sections' => false,
					),
				)
			);

			if ( is_wp_error( $plugin_api ) ) {
				$response = array(
					'message' => $plugin_api->get_error_message(),
					'status'  => 'api_error',
					'success' => false,
				);

				wp_send_json( $response );
				wp_die();
			}

			$skin     = new WP_Ajax_Upgrader_Skin();
			$upgrader = new Plugin_Upgrader( $skin );
			$result   = $upgrader->install( $plugin_api->download_link );

			if ( is_wp_error( $result ) ) {
				$response = array(
					'message' => $result->get_error_message(),
					'status'  => 'install_failedapi_error',
					'success' => false,
				);

				wp_send_json( $response );
				wp_die();
			}

			if ( is_wp_error( $skin->result ) ) {
				$response = array(
					'message' => $skin->result->get_error_message(),
					'status'  => 'skin_error',
					'success' => false,
				);

				wp_send_json( $response );
				wp_die();
			}

			// 3. Activate plugin after install.
			$activate = activate_plugin( $path );

			if ( is_wp_error( $activate ) ) {
				$response = array(
					'message' => $activate->get_error_message(),
					'status'  => 'activation_failed',
					'success' => false,
				);

				wp_send_json( $response );
				wp_die();
			}

			$response = array(
				'message' => sprintf(
					'%s installed and activated successfully.',
					esc_html( $plugin_api->name )
				),
				'status'  => 'installed_and_activated',
				'success' => true,
			);

			wp_send_json( $response );
			wp_die();
		}

		/**
		 * Bypass Redirect
		 *
		 * @since 1.0.0
		 */
		public function prevent_ajax_redirect() {

			return array(
				'message' => esc_html__( 'Redirect bypassed successfully.', 'captain-widgets-kit' ),
				'success' => true,
			);
		}

		/**
		 * Captwiki Set Response
		 *
		 * @since 1.0.0
		 * @param bool   $success    Success.
		 * @param string $message    Message.
		 * @param string $description Description.
		 * @param string $data       Data.
		 */
		public function captwiki_set_response( $success = false, $message = '', $description = '', $data = '' ) {

			$response = array(
				'success'     => $success,
				'message'     => esc_html( $message ),
				'description' => esc_html( $description ),
				'data'        => $data,
			);

			return $response;
		}
	}

	Captwiki_Dashboard_Ajax::get_instance();
}
