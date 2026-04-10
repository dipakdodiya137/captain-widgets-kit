<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @package  Captainwidgetskit
 *
 * @since 0.0.1
 */

use Elementor\Controls_Manager;
use Elementor\Widget_Base;
use Elementor\Plugin;
use Elementor\Utils;
use Elementor\Group_Control_Typography;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Background;
use Elementor\Group_Control_Box_Shadow;
use Elementor\Group_Control_Text_Shadow;
use Elementor\Group_Control_Image_Size;

/**
 * Exit if accessed directly.
 *
 * @since 0.0.1
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Captain Widgets Kit Class
 *
 * @category Elementor-extension
 * @package  Captainwidgetskit
 *
 * @since 0.0.1
 */
if ( ! class_exists( 'Captwiki_Preview_Reload_Mi9yvq26' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_Preview_Reload_Mi9yvq26 {

		/**
		 * Member Variable
		 *
		 * @since 0.0.1
		 * @var   self
		 */
		private static $instance;

		/**
		 * Initiator
		 *
		 * @since 0.0.1
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
		 * @since 0.0.1
		 */
		public function __construct() {
			add_action( 'elementor/element/container/section_layout/after_section_end', array( $this, 'captwiki_register_controls' ), 10, 2 );
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param object $element    Elementor element.
		 *
		 * @since 0.0.1
		 */
		public function captwiki_register_controls( $element ) {

			$element->start_controls_section(
				'section-1utfgu26',
				array(
					'label'   => esc_html__( 'Preview Reload', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_LAYOUT,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->add_control(
				'preview_m74lfd26',
				array(
					'label' => '<div class="elementor-update-preview" style="margin: 0;">
						<div class="elementor-update-preview-title">' . esc_html__( 'Update Preview Changes', 'captain-widgets-kit' ) . '</div>
							<div class="elementor-update-preview-button-wrapper">
								<button class="elementor-update-preview-button elementor-button"">' . esc_html__( 'Apply', 'captain-widgets-kit' ) . '</button>
							</div>
						</div>',
					'type'  => Controls_Manager::RAW_HTML,
				)
			);

			$element->end_controls_section();
		}
	}

	Captwiki_Preview_Reload_Mi9yvq26::get_instance();
}
