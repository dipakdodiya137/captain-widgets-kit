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
if ( ! class_exists( 'Captwiki_B_U_T_T_O_N_3eelll25' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_B_U_T_T_O_N_3eelll25 {

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
				'section-hy7hpo25',
				array(
					'label'   => esc_html__( 'I C O N - Options', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_STYLE,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->add_group_control(
				Group_Control_Typography::get_type(),
				array(
					'label'    => esc_html__( 'Typography', 'captain-widgets-kit' ),
					'name'     => 'typography_h48yr125',
					'selector' => '{{WRAPPER}} .elementor-button .elementor-button-icon i,.elementor-button .elementor-button-icon svg',
				)
			);

			$element->start_controls_tabs( 'normalhover_bje31z25', array() );

			$element->start_controls_tab(
				'normalhover_bje31z25_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_control(
				'color_l12xn325',
				array(
					'label'  => esc_html__( 'Color', 'captain-widgets-kit' ),
					'type'   => Controls_Manager::COLOR,
					'alpha'  => true,
					'global' => array(
						'active' => true,
					),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_43g1ao25',
					'types'    => array( 'classic', 'gradient' ),
					'selector' => '{{WRAPPER}} .elementor-button .elementor-button-icon',
				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_ekwrno25',
					'selector' => '{{WRAPPER}} .elementor-button .elementor-button-icon',
				)
			);

			$element->add_control(
				'dimension_459hq425',
				array(
					'label'      => esc_html__( 'Border Redius', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::DIMENSIONS,
					'classes'    => 'craft-test',
					'size_units' => array( 'px' ),
					'default'    => array(
						'top'      => '',
						'right'    => '',
						'bottom'   => '',
						'left'     => '',
						'unit'     => 'px',
						'isLinked' => 'true',
					),
				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_bje31z25_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_control(
				'color_3zz5mc25',
				array(
					'label'  => esc_html__( 'Color', 'captain-widgets-kit' ),
					'type'   => Controls_Manager::COLOR,
					'alpha'  => true,
					'global' => array(
						'active' => true,
					),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_ccaz4g25',
					'types'    => array( 'classic', 'gradient' ),
					'selector' => '{{WRAPPER}} .elementor-button:hover .elementor-button-icon ',
				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_3fqno525',
					'selector' => '{{WRAPPER}} .elementor-button:hover .elementor-button-icon',
				)
			);

			$element->add_control(
				'dimension_fi3v7b25',
				array(
					'label'      => esc_html__( 'Border Radius', 'captain-widgets-kit' ),
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

				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->end_controls_section();
		}
	}

	Captwiki_B_U_T_T_O_N_3eelll25::get_instance();
}
