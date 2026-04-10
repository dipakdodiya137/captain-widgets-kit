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
if ( ! class_exists( 'Captwiki_Fancy_Text_Settings_Bri1yx26' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_Fancy_Text_Settings_Bri1yx26 {

		/**
		 * Member Variable
		 *
		 * @since 0.0.1
		 * @var instance
		 */
		private static $instance;

		/**
		 * Initiator
		 *
		 * @since 0.0.1
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
			add_action( 'elementor/element/eael-fancy-text/eael_fancy_text_content/after_section_end', array( $this, 'captwiki_register_controls' ), 10, 2 );
			add_action( 'wp_enqueue_scripts', array( $this, 'captwiki_enqueue_style' ) );
			add_filter( 'elementor/widget/render_content', array( $this, 'captwiki_render_content' ), 10, 2 );
		}

		/**
		 * Enqueue styles.
		 *
		 * @since 0.0.1
		 */
		public function captwiki_enqueue_style() {
			$custom_css_url = CAPTWIKI_URL . 'includes/patch-load/patchs/fancy-text-settings-bri1yx26/fancy-text-settings-bri1yx26.css';
			wp_enqueue_style( 'captwiki-f7e5qm26-fancy-text-settings-bri1yx26', $custom_css_url, array(), time() );
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param object $element Elementor element.
		 *
		 * @since 0.0.1
		 */
		public function captwiki_register_controls( $element ) {

			$element->start_controls_section(
				'section-ijxyxx26',
				array(
					'label'   => esc_html__( 'Prefix Text Options', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_STYLE,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->start_controls_tabs( 'normalhover_48rrdo26', array() );

			$element->start_controls_tab(
				'normalhover_48rrdo26_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_zi648g26',
					'types'    => array( 'classic', 'gradient' ),
					'selector' => '{{WRAPPER}} .eael-fancy-text-prefix',
				)
			);

			$element->add_responsive_control(
				'slider_wavj8926',
				array(
					'label'              => esc_html__( 'Border Radius', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 100,
							'step' => 1,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 0,
					),
					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 0,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}} .eael-fancy-text-prefix' => 'border-radius:  {{SIZE}}{{UNIT}};' ),
				)
			);

			$element->add_control(
				'dimension_mibgzc26',
				array(
					'label'      => esc_html__( 'Padding', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::DIMENSIONS,
					'size_units' => array( 'px' ),
					'default'    => array(
						'top'      => '0',
						'right'    => '0',
						'bottom'   => '0',
						'left'     => '0',
						'unit'     => 'px',
						'isLinked' => 'true',
					),
					'selectors'  => array( '{{WRAPPER}} .eael-fancy-text-prefix' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),
				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_48rrdo26_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_gkx78326',
					'types'    => array( 'classic', 'gradient' ),
					'selector' => '{{WRAPPER}} .eael-fancy-text-prefix:hover',
				)
			);

			$element->add_responsive_control(
				'slider_x80a0y26',
				array(
					'label'              => esc_html__( 'Border Radius', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 100,
							'step' => 1,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 0,
					),
					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 0,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}} .eael-fancy-text-prefix:hover' => 'border-radius:  {{SIZE}}{{UNIT}};' ),
				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->end_controls_section();
			$element->start_controls_section(
				'section-doo2fy26',
				array(
					'label'   => esc_html__( 'Suffix Text Options', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_STYLE,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->start_controls_tabs( 'normalhover_7rwddh26', array() );

			$element->start_controls_tab(
				'normalhover_7rwddh26_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_lab08p26',
					'types'    => array( 'classic', 'gradient' ),
					'selector' => '{{WRAPPER}} .eael-fancy-text-suffix',
				)
			);

			$element->add_responsive_control(
				'slider_msy9sl26',
				array(
					'label'              => esc_html__( 'Border Radius', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 100,
							'step' => 1,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 0,
					),

					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 0,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}} .eael-fancy-text-suffix' => 'border-radius:  {{SIZE}}{{UNIT}};' ),
				)
			);

			$element->add_control(
				'dimension_xcmrzs26',
				array(
					'label'      => esc_html__( 'Padding', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::DIMENSIONS,
					'size_units' => array( 'px' ),
					'default'    => array(
						'top'      => '0',
						'right'    => '0',
						'bottom'   => '0',
						'left'     => '0',
						'unit'     => 'px',
						'isLinked' => 'true',
					),
					'selectors'  => array( '{{WRAPPER}} ..eael-fancy-text-suffix' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),
				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_7rwddh26_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_agl8yt26',
					'types'    => array( 'classic', 'gradient' ),
					'selector' => '{{WRAPPER}} .eael-fancy-text-suffix:hover',
				)
			);

			$element->add_responsive_control(
				'slider_5gj7ct26',
				array(
					'label'              => esc_html__( 'Border Radius', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 100,
							'step' => 1,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 0,
					),
					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 0,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 0,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}} .eael-fancy-text-suffix:hover' => 'border-radius:  {{SIZE}}{{UNIT}};' ),
				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->end_controls_section();
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param string $content Content.
		 * @param object $element Element.
		 *
		 * @since 0.0.1
		 */
		public function captwiki_render_content( $content, $element ) {

			if ( 'eael-fancy-text' !== $element->get_name() ) {
				return;}

			$settings = $element->get_settings_for_display();

			return $content;
		}
	}

	Captwiki_Fancy_Text_Settings_Bri1yx26::get_instance();
}
