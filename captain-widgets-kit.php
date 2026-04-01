<?php
/**
 * Plugin Name: Captain Widgets Kit
 * Plugin URI: https://wordpress.org/plugins/captain-widgets-kit
 * Description: Extend Elementor widgets with advanced controls and flexible customization options directly inside the Elementor editor.
 * Version: 0.0.1
 * Author: dipakdodiya
 * Author URI: https://profiles.wordpress.org/dipakdodiya
 * License: GPLv3
 * License URI: https://opensource.org/licenses/GPL-3.0
 * Text Domain: captain-widgets-kit
 * Domain Path: /languages/
 *
 * @package captain-widgets-kit
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CAPTWIKI_VERSION', '0.0.1' );
define( 'CAPTWIKI_FILE', __FILE__ );
define( 'CAPTWIKI_PATH', plugin_dir_path( __FILE__ ) );
define( 'CAPTWIKI_URL', plugin_dir_url( __FILE__ )  );
define( 'CAPTWIKI_ASSETS', CAPTWIKI_URL . 'assets/' );
define( 'CAPTWIKI_UPPATH', wp_upload_dir()['basedir'] . '/captain-widgets-kit' );

require_once CAPTWIKI_PATH . 'includes/class-captwiki-load.php';
