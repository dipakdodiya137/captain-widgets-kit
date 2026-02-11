<?php
/**
 * Plugin Name: Captain Widgets Kit
 * Plugin URI: https://wordpress.org/plugins/captain-widgets-kit
 * Description: A powerful, user-friendly editor for adding custom CSS, JavaScript, and PHP to your site. Perfect for developers and designers who want complete control over their web projects.
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

define( 'CWK_VERSION', '0.0.1' );
define( 'CWK_FILE', __FILE__ );
define( 'CWK_PATH', plugin_dir_path( __FILE__ ) );
define( 'CWK_URL', plugins_url( '/', __FILE__ ) );
define( 'CWK_ASSETS', CWK_URL . 'assets/' );
define( 'CWK_PBNAME', plugin_basename( __FILE__ ) );
define( 'CWK_UPPATH', wp_upload_dir()['basedir'] . '/captain-widgets-kit' );

require CWK_PATH . 'includes/class-cwk-load.php';
