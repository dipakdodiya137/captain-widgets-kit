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
if ( ! class_exists( 'Captwiki_Container_Morph_Fdfsj725' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_Container_Morph_Fdfsj725 {

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
			add_action( 'elementor/element/container/section_layout/after_section_end', array( $this, 'captwiki_register_controls' ), 10, 2 );
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param object $element Elementor element.
		 * @since 0.0.1
		 */
		public function captwiki_register_controls( $element ) {

			$element->start_controls_section(
				'section-qjjryp25',
				array(
					'label'   => esc_html__( 'Container Morph', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_LAYOUT,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->start_controls_tabs( 'normalhover_m1q30i25', array() );

			$element->start_controls_tab(
				'normalhover_m1q30i25_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_control(
				'textarea_oxiq2z25',
				array(
					'label'     => esc_html__( 'Clip Path', 'captain-widgets-kit' ),
					'type'      => Controls_Manager::TEXTAREA,
					'ai'        => array( 'active' => false ),
					'selectors' => array( '{{WRAPPER}}' => '{{VALUE}}' ),
					'rows'      => '3',
				)
			);

			$element->add_control(
				'rawhtml_ke6jza25',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post( '<p style="font-size: 11px; font-style: italic; line-height: 1.4; color: #818A96;"> Enter the full clip-path property! See the copy-paste examples at <a href="https://bennettfeely.com/clippy/" target="_blank">Clippy</a> </p>' ),
					'show_label'  => false,
					'label_block' => true,
				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_m1q30i25_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_control(
				'textarea_i2vjj625',
				array(
					'label'     => esc_html__( 'Clip Path', 'captain-widgets-kit' ),
					'type'      => Controls_Manager::TEXTAREA,
					'ai'        => array( 'active' => false ),
					'selectors' => array( '{{WRAPPER}}:hover' => '{{VALUE}}' ),
					'rows'      => '3',
				)
			);

			$element->add_control(
				'rawhtml_88di2125',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post( '<p style="font-size: 11px; font-style: italic; line-height: 1.4; color: #818A96;"> Enter the full clip-path property! See the copy-paste examples at <a href="https://bennettfeely.com/clippy/" target="_blank">Clippy</a> </p>' ),
					'show_label'  => false,
					'label_block' => true,
				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->add_control(
				'switcher_14f4tm25',
				array(
					'label'        => esc_html__( 'Hover Animate?', 'captain-widgets-kit' ),
					'type'         => Controls_Manager::SWITCHER,
					'label_on'     => esc_html__( 'Yes', 'captain-widgets-kit' ),
					'label_off'    => esc_html__( 'No', 'captain-widgets-kit' ),
					'return_value' => esc_html__( 'Yes', 'captain-widgets-kit' ),
				)
			);

			$element->add_responsive_control(
				'slider_uoa15h25',
				array(
					'label'              => esc_html__( 'Animation duration', 'captain-widgets-kit' ),
					'type'               => Controls_Manager::SLIDER,
					'size_units'         => array( 'px' ),
					'range'              => array(
						'px' => array(
							'min'  => 0,
							'max'  => 1,
							'step' => 0.1,
						),
					),
					'default'            => array(
						'unit' => 'px',
						'size' => 0.1,
					),
					'tablet_default'     => array(
						'unit' => 'px',
						'size' => 0.1,
					),
					'mobile_default'     => array(
						'unit' => 'px',
						'size' => 0.1,
					),
					'widescreen_default' => array(
						'unit' => 'px',
						'size' => 0.1,
					),
					'label_block'        => true,
					'selectors'          => array( '{{WRAPPER}}' => 'transition: clip-path {{SIZE}}s ease 0s' ),
					'conditions'         => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_14f4tm25',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->add_control(
				'divider_zlduv125',
				array(
					'type'       => Controls_Manager::DIVIDER,
					'conditions' => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_14f4tm25',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->add_control(
				'animation_99nmzu25',
				array(
					'label'        => esc_html__( 'Animation effect', 'captain-widgets-kit' ),
					'type'         => Controls_Manager::ANIMATION,
					'prefix_class' => 'animated ',
					'label_block'  => true,
					'conditions'   => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_14f4tm25',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->end_controls_section();
		}
	}

	Captwiki_Container_Morph_Fdfsj725::get_instance();
}
