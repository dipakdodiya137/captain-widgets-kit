<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @package  Captainwidgetskit
 *
 * @since    0.0.1
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
if ( ! class_exists( 'Captwiki_Card_Settings_Muyei426' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_Card_Settings_Muyei426 {

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
			add_action( 'elementor/element/ha-card/_section_image/after_section_end', array( $this, 'captwiki_register_controls' ), 10, 2 );
			add_filter( 'elementor/widget/render_content', array( $this, 'captwiki_render_content' ), 10, 2 );
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param object $element The widget element.
		 * @since 0.0.1
		 */
		public function captwiki_register_controls( $element ) {

			$element->start_controls_section(
				'section-7e3q4926',
				array(
					'label'   => esc_html__( 'Title & Description Options', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_STYLE,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->add_control(
				'rawhtml_vl33oo26',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post( '<b>Title</b>' ),

					'show_label'  => false,
					'label_block' => true,

				)
			);

			$element->add_control(
				'divider_0d3j2j26',
				array(
					'type' => Controls_Manager::DIVIDER,

				)
			);

			$element->start_controls_tabs( 'normalhover_6i0d5n26', array() );

			$element->start_controls_tab(
				'normalhover_6i0d5n26_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_pjgosr26',
					'types'    => array( 'classic', 'gradient' ),

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title',

				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_tfw4in26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title',

				)
			);

			$element->add_control(
				'dimension_3mswob26',
				array(
					'label'      => esc_html__( 'Padding', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::DIMENSIONS,

					'size_units' => array( 'px' ),
					'default'    => array(
						'top'      => '',
						'right'    => '',
						'bottom'   => '',
						'left'     => '',
						'unit'     => 'px',
						'isLinked' => 'true',
					),

					'selectors'  => array( '{{WRAPPER}} .ha-card-body .ha-card-title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),

				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_htjc7926',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title',

				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_ocja8026',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title',

				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_6i0d5n26_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_qh15rm26',
					'types'    => array( 'classic', 'gradient' ),

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title:hover',

				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_ftulfo26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title:hover',

				)
			);

			$element->add_control(
				'dimension_8bvv2026',
				array(
					'label'      => esc_html__( 'Padding', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::DIMENSIONS,

					'size_units' => array( 'px' ),
					'default'    => array(
						'top'      => '',
						'right'    => '',
						'bottom'   => '',
						'left'     => '',
						'unit'     => 'px',
						'isLinked' => 'true',
					),

					'selectors'  => array( '{{WRAPPER}} .ha-card-body .ha-card-title:hover' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),

				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_q3wz0d26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title:hover',

				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_5j2ny226',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-title:hover',

				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->add_control(
				'rawhtml_dr4c0l26',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post( '<b>Description</b>' ),

					'show_label'  => false,
					'label_block' => true,

				)
			);

			$element->add_control(
				'divider_bjyucu26',
				array(
					'type' => Controls_Manager::DIVIDER,

				)
			);

			$element->start_controls_tabs( 'normalhover_swm7xn26', array() );

			$element->start_controls_tab(
				'normalhover_swm7xn26_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_c9pz3a26',
					'types'    => array( 'classic', 'gradient' ),

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_fqmfgr26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->add_control(
				'dimension_44ce7126',
				array(
					'label'      => esc_html__( 'Padding', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::DIMENSIONS,

					'size_units' => array( 'px' ),
					'default'    => array(
						'top'      => '',
						'right'    => '',
						'bottom'   => '',
						'left'     => '',
						'unit'     => 'px',
						'isLinked' => 'true',
					),

					'selectors'  => array( '{{WRAPPER}} .ha-card-body .ha-card-text ' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),

				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_ltgzkl26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_r4a5te26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_swm7xn26_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_44v0zy26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_tgseg226',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->add_control(
				'dimension_d5x8x726',
				array(
					'label'      => esc_html__( 'Padding', 'captain-widgets-kit' ),
					'type'       => Controls_Manager::DIMENSIONS,

					'size_units' => array( 'px' ),
					'default'    => array(
						'top'      => '',
						'right'    => '',
						'bottom'   => '',
						'left'     => '',
						'unit'     => 'px',
						'isLinked' => 'true',
					),

					'selectors'  => array( '{{WRAPPER}} .ha-card-body .ha-card-text ' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),

				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_mb1igq26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_27qxcs26',

					'selector' => '{{WRAPPER}} .ha-card-body .ha-card-text ',

				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->end_controls_section();
		}

		/**
		 * Render the content for the widget.
		 *
		 * @param string $content The content to be rendered.
		 * @param object $element The widget element.
		 *
		 * @return string The modified content.
		 */
		public function captwiki_render_content( $content, $element ) {

			if ( 'ha-card' !== $element->get_name() ) {
				return; }

			$settings = $element->get_settings_for_display();

			return $content;
		}
	}

	Captwiki_Card_Settings_Muyei426::get_instance();
}
