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
 * It is Main Class
 *
 * @since 0.0.1
 */
if ( ! class_exists( 'Captwiki_Animated_Border_2wr6ht25' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_Animated_Border_2wr6ht25 {


		/**
		 * Member Variable
		 *
		 * @var instance
		 */
		private static $instance;

		/**
		 * Initiator
		 *
		 * @since  0.0.1
		 * @return self
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
			add_action( 'elementor/element/button/section_button/after_section_end', array( $this, 'captwiki_register_controls' ), 10, 2 );
			add_action( 'wp_enqueue_scripts', array( $this, 'captwiki_enqueue_style' ) );
			add_filter( 'elementor/widget/render_content', array( $this, 'captwiki_render_content' ), 10, 2 );
		}

		/**
		 * Enqueue styles.
		 *
		 * @since 0.0.1
		 */
		public function captwiki_enqueue_style() {
			$custom_css_url = CAPTWIKI_URL . 'includes/patch-load/patchs/animated-border-2wr6ht25/animated-border-2wr6ht25.css';
			wp_enqueue_style( 'captwiki-mkgznq26-animated-border_2wr6ht25', $custom_css_url, array(), time() );
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param object $element Elementor element.
		 * @since 0.0.1
		 */
		public function captwiki_register_controls( $element ) {

			$element->start_controls_section(
				'section-nt3msk24',
				array(
					'label'   => esc_html__( 'Animated Border 1', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_CONTENT,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->add_control(
				'switcher_tvbcg225',
				array(
					'label'        => esc_html__( 'Enable Animated Border 1', 'captain-widgets-kit' ),
					'type'         => Controls_Manager::SWITCHER,
					'label_on'     => esc_html__( 'Yes', 'captain-widgets-kit' ),
					'label_off'    => esc_html__( 'No', 'captain-widgets-kit' ),
					'return_value' => 'Yes',
					'default'      => '',
				)
			);

			$element->end_controls_section();
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param string $content content.
		 * @param object $element Elementor element.
		 *
		 * @since 0.0.1
		 */
		public function captwiki_render_content( $content, $element ) {
			$settings = $element->get_settings_for_display();

			if ( 'button' !== $element->get_name() ) {
				return;
			}

			$element_id = $element->get_id();
			$dd_style   = isset( $settings['switcher_tvbcg225'] ) ? $settings['switcher_tvbcg225'] : '';

			if ( 'Yes' === $dd_style ) {
				$element->add_render_attribute( '_wrapper', 'class', 'captwiki-animated-border-one' );
				$element->add_render_attribute( 'button', 'style', 'position: relative;' );
			}

			return $content;
		}
	}

	Captwiki_Animated_Border_2wr6ht25::get_instance();
}
