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
 * @since 0.0.1
 */
if ( ! class_exists( 'Captwiki_Animated_Border_4_584igq25' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_Animated_Border_4_584igq25 {

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
		 * Enqueue scripts.
		 *
		 * @since 0.0.1
		 */
		public function captwiki_enqueue_style() {
			$custom_css_url = CAPTWIKI_URL . 'includes/patch-load/patchs/animated-border-4-584igq25/animated-border-4-584igq25.css';
			wp_enqueue_style( 'captwiki-yj9yxx26-animated-border-4-584igq25', $custom_css_url, array(), time() );
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
				'section-zvtx8425',
				array(
					'label'   => esc_html__( 'Animated Border 4', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_CONTENT,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->add_control(
				'switcher_2yk6e525',
				array(
					'label'        => esc_html__( 'Enable Animated Border 4', 'captain-widgets-kit' ),
					'type'         => Controls_Manager::SWITCHER,
					'label_on'     => esc_html__( 'Yes', 'captain-widgets-kit' ),
					'label_off'    => esc_html__( 'No', 'captain-widgets-kit' ),
					'return_value' => esc_html__( 'Yes', 'captain-widgets-kit' ),
					'default'      => '',

				)
			);

			$element->add_control(
				'color_s8iadi25',
				array(
					'label'      => esc_html__( 'Color', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::COLOR,
					'default'    => '#fb00ff',
					'alpha'      => true,
					'selectors'  => array( '{{WRAPPER}}.captwiki-animated-border-four .elementor-button::after' => 'background-color: {{VALUE}}' ),
					'global'     => array(
						'active' => true,
					),
					'conditions' => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_2yk6e525',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->add_responsive_control(
				'slider_be7sz925',
				array(
					'label'              => esc_html__( 'Height', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 50,
							'step' => 1,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 2,
					),
					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 2,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 2,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 2,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}}.captwiki-animated-border-four .elementor-button::after' => 'height: {{SIZE}}{{UNIT}}' ),
					'conditions'         => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_2yk6e525',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->add_responsive_control(
				'slider_otdahg25',
				array(
					'label'              => esc_html__( 'Width', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 300,
							'step' => 1,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 50,
					),
					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 50,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 50,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 50,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}}.captwiki-animated-border-four .elementor-button:hover::after' => 'width: {{SIZE}}{{UNIT}}' ),
					'conditions'         => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_2yk6e525',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->add_responsive_control(
				'slider_8htsyg25',
				array(
					'label'              => esc_html__( 'Transition Effect', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 1,
							'step' => 0.3,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 0.3,
					),
					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 0.3,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 0.3,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 0.3,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}}.captwiki-animated-border-four .elementor-button::after' => 'transition: width {{SIZE}}s ease-in-out' ),
					'conditions'         => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_2yk6e525',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->end_controls_section();
		}

		/**
		 * Render Button widget output on the frontend.
		 *
		 * Written as a method of the widget class to help keep the code organized.
		 *
		 * @param string $content Content.
		 * @param object $element Element.
		 * @since 0.0.1
		 */
		public function captwiki_render_content( $content, $element ) {
			$settings = $element->get_settings_for_display();

			if ( 'button' !== $element->get_name() ) {
				return;
			}

			$dd_style = isset( $settings['switcher_2yk6e525'] ) ? $settings['switcher_2yk6e525'] : '';
			if ( 'Yes' === $dd_style ) {
				$element->add_render_attribute( '_wrapper', 'class', 'captwiki-animated-border-four' );
				$element->add_render_attribute( 'button', 'style', 'position: relative;' );
			}

			return $content;
		}
	}

	Captwiki_Animated_Border_4_584igq25::get_instance();
}
