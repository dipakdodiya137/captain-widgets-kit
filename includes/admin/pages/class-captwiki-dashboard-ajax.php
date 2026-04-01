<?php
/**
 * Captwiki Dashboard Ajax
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
 * Captwiki_Dashboard_Ajax
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
				case 'get_addons_widgets_list':
					$response = $this->get_addons_widgets_list();
					break;
				case 'set_create_file':
					$response = $this->set_create_file();
					break;
				case 'get_patch_list':
					$response = $this->get_patch_list();
					break;
				case 'get_single_patch':
					$response = $this->get_single_patch();
					break;
				case 'delete_single_patch':
					$response = $this->delete_single_patch();
					break;
				case 'captwiki_manage_setting':
					$response = $this->captwiki_manage_setting();
					break;
				case 'save_settings':
					$response = $this->save_settings();
					break;
				case 'get_widget_controls_structure':
					$response = $this->get_widget_controls_structure();
					break;
				case 'get_browse_list':
					$response = $this->get_browse_list();
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
		 * Get Elementor Addons Array List
		 *
		 * @since 1.0.0
		 */
		public function get_addons_widgets_list() {

			$plugin  = \Elementor\Plugin::instance();
			$widgets = array();

			if ( method_exists( $plugin->widgets_manager, 'get_widget_types' ) ) {
				$widgets = $plugin->widgets_manager->get_widget_types();
			} elseif ( isset( $plugin->widgets_manager->widgets ) ) {
				$widgets = $plugin->widgets_manager->widgets;
			} elseif ( method_exists( $plugin->widgets_manager, 'get_registered_widgets' ) ) {
				$widgets = $plugin->widgets_manager->get_registered_widgets();
			}

			if ( empty( $widgets ) ) {
				$response = $this->captwiki_set_response( false, 'No widgets found.', 'No widgets found.' );

				wp_send_json( $response );
				return;
			}

			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$all_plugins = get_plugins();

			$addons            = array();
			$plugin_slug_array = array();
			$added_plugins     = array();

			foreach ( $widgets as $id => $widget_obj ) {
				$class = get_class( $widget_obj );
				$name  = method_exists( $widget_obj, 'get_title' ) ? $widget_obj->get_title() : $id;

				$ref  = new ReflectionClass( $class );
				$file = $ref->getFileName();

				$plugin_name   = 'Elementor core / Unknown';
				$original_slug = '';
				$plugin_slug   = '';

				if ( $file ) {
					$file = wp_normalize_path( $file );
					foreach ( $all_plugins as $plugin_path => $plugin_data ) {
						$plugin_dir = wp_normalize_path( trailingslashit( WP_PLUGIN_DIR ) . dirname( $plugin_path ) );
						if ( strpos( $file, $plugin_dir ) === 0 ) {
							$plugin_name = $plugin_data['Name'] ?? $plugin_path;

							// Folder name = original slug.
							$original_slug = dirname( $plugin_path );

							// Full plugin slug.
							$plugin_slug = $plugin_path;
							break;
						}
					}
				}

				if ( ! isset( $addons[ $plugin_name ] ) ) {
					$addons[ $plugin_name ] = array();
				}

				if ( ! empty( $plugin_slug ) && ! in_array( $plugin_slug, $added_plugins, true ) ) {
					$added_plugins[]     = $plugin_slug;
					$plugin_slug_array[] = array(
						'plugin_name'   => $plugin_name,
						'original_slug' => $original_slug,
						'plugin_slug'   => $plugin_slug,
					);
				}

				$addons[ $plugin_name ][] = array(
					'id'   => $id,
					'name' => $name,
				);
			}

			$result = array(
				'addons'      => $addons,
				'plugin_list' => $plugin_slug_array,
			);

			$response = $this->captwiki_set_response( true, 'success.', 'success.', $result );

			wp_send_json( $response );
		}

		/**
		 * Get Elementor Addons Array List
		 *
		 * @since 1.0.0
		 */
		public function set_create_file() {

			if ( ! check_ajax_referer( 'captwiki_nonce', 'nonce', false ) ) {

				$response = $this->captwiki_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );

				wp_send_json( $response );
				wp_die();
			}

			$base_dir = CAPTWIKI_UPPATH;

			$file_name   = ! empty( $_POST['file_name'] ) ? sanitize_text_field( wp_unslash( $_POST['file_name'] ) ) : '';
			$folder_name = ! empty( $_POST['folder_name'] ) ? sanitize_text_field( wp_unslash( $_POST['folder_name'] ) ) : '';

			$php_code  = ! empty( $_POST['elementor_php_file'] ) ? wp_unslash( $_POST['elementor_php_file'] ) : '';
			$js_code   = ! empty( $_POST['elementor_js'] ) ? sanitize_text_field( wp_unslash( $_POST['elementor_js'] ) ) : '';
			$css_code  = ! empty( $_POST['elementor_css'] ) ? sanitize_text_field( wp_unslash( $_POST['elementor_css'] ) ) : '';
			$json_file = ! empty( $_POST['json_file'] ) ? sanitize_text_field( wp_unslash( $_POST['json_file'] ) ) : '';

			$file_name   = sanitize_file_name( $file_name );
			$folder_name = sanitize_file_name( $folder_name );

			if ( ! is_dir( $base_dir ) ) {
				wp_mkdir_p( $base_dir );
			}

			$folder_path = trailingslashit( $base_dir ) . $folder_name;

			require_once ABSPATH . 'wp-admin/includes/file.php';
			WP_Filesystem();

			global $wp_filesystem;

			if ( ! $wp_filesystem ) {
				$response = $this->captwiki_set_response( false, 'Filesystem error.', 'Could not access the filesystem.' );
				wp_send_json( $response );
				return;
			}

			if ( ! $wp_filesystem->is_dir( $folder_path ) ) {
				$wp_filesystem->mkdir( $folder_path );
			}

			$widget_file_path = trailingslashit( $folder_path ) . $file_name . '.php';
			$widget_js_path   = trailingslashit( $folder_path ) . $file_name . '.js';
			$widget_css_path  = trailingslashit( $folder_path ) . $file_name . '.css';
			$widget_json_path = trailingslashit( $folder_path ) . $file_name . '.json';

			if ( ! empty( $php_code ) ) {

				if ( $wp_filesystem->exists( $widget_file_path ) ) {
					$wp_filesystem->delete( $widget_file_path );
				}

				$wp_filesystem->put_contents( $widget_file_path, $php_code, FS_CHMOD_FILE );
			}

			if ( ! empty( $js_code ) ) {

				if ( $wp_filesystem->exists( $widget_js_path ) ) {
					$wp_filesystem->delete( $widget_js_path );
				}

				$wp_filesystem->put_contents( $widget_js_path, $js_code, FS_CHMOD_FILE );
			}

			if ( ! empty( $css_code ) ) {

				if ( $wp_filesystem->exists( $css_code ) ) {
						$wp_filesystem->delete( $css_code );
				}

				$wp_filesystem->put_contents( $widget_css_path, $css_code, FS_CHMOD_FILE );
			}

			if ( ! empty( $json_file ) ) {
				$decoded_json = json_decode( $json_file, true );
				if ( json_last_error() === JSON_ERROR_NONE ) {
					$wp_filesystem->put_contents( $widget_json_path, wp_json_encode( $decoded_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE ), FS_CHMOD_FILE );
				} else {
					$wp_filesystem->put_contents( $widget_json_path, $json_file, FS_CHMOD_FILE );
				}
			}

			wp_send_json(
				array(
					'success' => true,
					'message' => esc_html__( 'All files created successfully.', 'captain-widgets-kit' ),
				)
			);
		}

		/**
		 * Get Patch File Data
		 *
		 * @since 1.0.0
		 */
		public function get_patch_list() {

			global $wp_filesystem;

			if ( empty( $wp_filesystem ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
				WP_Filesystem();
			}

			$base_dir = CAPTWIKI_UPPATH;

			if ( ! is_dir( $base_dir ) ) {
				$response = $this->captwiki_set_response( false, 'No folder found.', 'No folder found.' );

				wp_send_json( $response );
				return;
			}

			$folders = scandir( $base_dir );
			$folders = array_diff( $folders, array( '.', '..' ) );

			$result = array();
			foreach ( $folders as $folder ) {
				$folder_path = trailingslashit( $base_dir ) . $folder;

				if ( is_dir( $folder_path ) ) {
					$files = scandir( $folder_path );
					$files = array_diff( $files, array( '.', '..' ) );

					foreach ( $files as $file ) {
						$file_path = trailingslashit( $folder_path ) . $file;

						if ( pathinfo( $file_path, PATHINFO_EXTENSION ) === 'json' ) {
							$json_content = $wp_filesystem->get_contents( $file_path );

							if ( empty( $json_content ) ) {
								$result[] = array(
									'file'    => $file,
									'folder'  => $folder,
									'path'    => $file_path,
									'data'    => array(),
									'success' => false,
									'content' => esc_html__( 'Empty JSON file.', 'captain-widgets-kit' ),
								);
							}

							$json_content = json_decode( $json_content, true );
							if ( JSON_ERROR_NONE === json_last_error() ) {
								$result[] = array(
									'file'    => $file,
									'folder'  => $folder,
									'path'    => $file_path,
									'data'    => $json_content,
									'success' => true,
									'content' => esc_html__( 'Success', 'captain-widgets-kit' ),
								);
							} else {
								$result[] = array(
									'file'    => $file,
									'folder'  => $folder,
									'path'    => $file_path,
									'data'    => array(),
									'success' => false,
									'content' => JSON_ERROR_NONE === $json_error ? false : json_last_error_msg(),
								);
							}
						}
					}
				}
			}

			$response = $this->captwiki_set_response( true, 'Patch list fetched successfully.', 'Patch list fetched successfully.', $result );

			wp_send_json( $response );
		}

		/**
		 * Get Single Patch File Data
		 *
		 * @since 1.0.0
		 */
		public function get_single_patch() {

			if ( ! check_ajax_referer( 'captwiki_nonce', 'nonce', false ) ) {

				$response = $this->captwiki_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );

				wp_send_json( $response );
				wp_die();
			}

			global $wp_filesystem;

			$folder_name = ! empty( $_POST['folder_name'] ) ? sanitize_file_name( wp_unslash( $_POST['folder_name'] ) ) : '';
			$file_name   = ! empty( $_POST['file_name'] ) ? sanitize_file_name( wp_unslash( $_POST['file_name'] ) ) : '';

			if ( empty( $folder_name ) || empty( $file_name ) ) {
				$response = $this->captwiki_set_response( true, 'Folder name or file name missing.', 'Folder name or file name missing.', array() );
				wp_send_json( $response );
			}

			$base_dir  = CAPTWIKI_UPPATH;
			$file_path = trailingslashit( $base_dir ) . trailingslashit( $folder_name ) . $file_name . '.json';

			if ( ! file_exists( $file_path ) ) {
				$response = $this->captwiki_set_response( true, 'File not found.', 'File not found.', array() );
				wp_send_json( $response );
			}

			if ( empty( $wp_filesystem ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
				WP_Filesystem();
			}

			$json_content = $wp_filesystem->get_contents( $file_path );

			if ( ! $json_content ) {
				$response = $this->captwiki_set_response( true, 'Could not read file.', 'Could not read file', array() );
				wp_send_json( $response );
			}

			$data       = json_decode( $json_content, true );
			$json_error = json_last_error();

			$response = array(
				'folder'      => $folder_name,
				'file'        => $file_name . '.json',
				'path'        => $file_path,
				'data'        => $data,
				'json_error'  => JSON_ERROR_NONE === $json_error ? false : json_last_error_msg(),
				'message'     => esc_html__( 'success', 'captain-widgets-kit' ),
				'description' => esc_html__( 'success', 'captain-widgets-kit' ),
			);

			wp_send_json( $response );
		}

		/**
		 * Get Patch File Data
		 *
		 * @since 1.0.0
		 */
		public function delete_single_patch() {

			if ( ! check_ajax_referer( 'captwiki_nonce', 'nonce', false ) ) {

				$response = $this->captwiki_set_response( false, 'Invalid nonce.', 'The security check failed. Please refresh the page and try again.' );

				wp_send_json( $response );
				wp_die();
			}

			global $wp_filesystem;

			$folder_name = ! empty( $_POST['folder'] ) ? sanitize_file_name( wp_unslash( $_POST['folder'] ) ) : '';
			$file_name   = ! empty( $_POST['file'] ) ? sanitize_file_name( wp_unslash( $_POST['file'] ) ) : '';

			if ( empty( $folder_name ) || empty( $file_name ) ) {
				$response = $this->captwiki_set_response( true, 'Folder name or file name missing.', 'Folder name or file name missing.', array() );
				wp_send_json( $response );
			}

			$base_dir    = CAPTWIKI_UPPATH;
			$folder_path = trailingslashit( $base_dir ) . $folder_name;
			$file_path   = trailingslashit( $base_dir ) . trailingslashit( $folder_name ) . $file_name;

			$real_base = realpath( $base_dir );
			$real_file = realpath( $file_path );

			if ( ! $real_file || strpos( $real_file, $real_base ) !== 0 ) {
				$response = $this->captwiki_set_response( true, 'Invalid file path.', 'Invalid file path.', array() );
				wp_send_json( $response );
			}

			if ( empty( $wp_filesystem ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
				WP_Filesystem();
			}

			if ( ! $wp_filesystem->is_dir( $folder_path ) ) {
				$response = $this->captwiki_set_response( true, 'Folder does not exist.', 'Folder does not exist.', array() );
				wp_send_json( $response );
			}

			$deleted = $wp_filesystem->rmdir( $folder_path, true );

			if ( ! $deleted ) {
				$response = $this->captwiki_set_response( true, 'Failed to delete folder.', 'Failed to delete folder.', array() );
				wp_send_json( $response );
			}

			wp_send_json_success(
				array(
					'folder'      => $folder_name,
					'file'        => $file_name,
					'path'        => $file_path,
					'success'     => true,
					'message'     => esc_html__( 'success.', 'captain-widgets-kit' ),
					'description' => esc_html__( 'success.', 'captain-widgets-kit' ),
				)
			);
		}

		/**
		 *
		 * It is Use for Check Plugin Dependency of template.
		 *
		 * @since 1.0.0
		 * @version 1.0.0
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
		 * Browse Page.
		 *
		 * @since 1.0.0
		 */
		public function get_browse_list() {

			global $wp_filesystem;

			if ( empty( $wp_filesystem ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
				WP_Filesystem();
			}

			$base_dir = CAPTWIKI_PATH . 'includes/admin/browse-page';

			if ( ! is_dir( $base_dir ) ) {
				$response = $this->captwiki_set_response( false, 'No folder found.', 'No folder found.' );

				wp_send_json( $response );
				return;
			}

			$folders = scandir( $base_dir );
			$folders = array_diff( $folders, array( '.', '..' ) );

			$result = array();
			foreach ( $folders as $file_name ) {
				$file_path = trailingslashit( $base_dir ) . $file_name;

				if ( pathinfo( $file_path, PATHINFO_EXTENSION ) === 'json' ) {

					$json_content = $wp_filesystem->get_contents( $file_path );

					if ( empty( $json_content ) ) {
						$result[] = array(
							'file'    => $file_name,
							'path'    => $file_path,
							'data'    => array(),
							'time'    => '',
							'success' => false,
							'content' => esc_html__( 'Empty JSON file.', 'captain-widgets-kit' ),
						);
					}

					$json_content = json_decode( $json_content, true );
					if ( JSON_ERROR_NONE === json_last_error() ) {
						$result[] = array(
							'file'    => $file_name,
							'path'    => $file_path,
							'data'    => $json_content,
							'time'    => isset( $json_content['widget_info']['created_at'] ) ? $json_content['widget_info']['created_at'] : '',
							'success' => true,
							'content' => esc_html__( 'Success', 'captain-widgets-kit' ),
						);
					} else {
						$result[] = array(
							'file'    => $file_name,
							'path'    => $file_path,
							'data'    => array(),
							'time'    => '',
							'success' => false,
							'content' => JSON_ERROR_NONE === $json_error ? false : json_last_error_msg(),
						);
					}
				}
			}

			usort(
				$result,
				function ( $a, $b ) {
					return strtotime( $b['time'] ?? 0 ) <=> strtotime( $a['time'] ?? 0 );
				}
			);

			$response = $this->captwiki_set_response( true, 'Success.', 'Success.', $result );

			wp_send_json( $response );
			wp_die();
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

			if ( file_exists( WP_PLUGIN_DIR . '/' . $path ) ) {

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
