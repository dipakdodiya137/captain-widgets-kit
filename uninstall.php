<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * @since      1.0.0
 *
 * @package    Captain Widgets Kit
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$get_setting = get_option( 'captwiki_settings', false );

if ( ! empty( $get_setting['cleanup_db'] ) && $get_setting['cleanup_db'] == true ) {
    delete_option( 'captwiki_settings' );
}
