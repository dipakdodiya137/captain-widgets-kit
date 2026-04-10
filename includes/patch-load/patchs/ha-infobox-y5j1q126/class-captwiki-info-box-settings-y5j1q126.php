<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @package  Captainwidgetskit
 *
 * @since      0.0.1
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
 * @author   Dipak Dodiya <dipakdodiya@users.noreply.wordpress.org>
 * @license  GPL-2.0-or-later https://www.gnu.org/licenses/gpl-2.0.html
 * @link     https://wordpress.org/plugins/captain-widgets-kit
 *
 * @since 0.0.1
 */
if ( ! class_exists( 'Captwiki_Info_Box_Settings_Y5j1q126' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 * @var   self
	 */
	class Captwiki_Info_Box_Settings_Y5j1q126 {

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
		 * @since  0.0.1
		 * @return void
		 */
		public function __construct() {
			add_action( 'elementor/element/ha-infobox/_section_media/after_section_end', array( $this, 'captwiki_register_controls' ), 10, 2 );
			add_filter( 'elementor/widget/render_content', array( $this, 'captwiki_render_content' ), 10, 2 );
		}

		/**
		 * Register controls.
		 *
		 * @param object $element    Elementor element.
		 *
		 * @return void
		 */
		public function captwiki_register_controls( $element ) {

			$element->start_controls_section(
				'section-iaaykh26',
				array(
					'label'   => esc_html__( 'Title & Description Options', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_STYLE,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->add_control(
				'rawhtml_ovcho426',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post( 'Title' ),
					'show_label'  => false,
					'label_block' => true,
				)
			);

			$element->add_control(
				'divider_rdxoze26',
				array(
					'type' => Controls_Manager::DIVIDER,
				)
			);

			$element->start_controls_tabs( 'normalhover_buaal226', array() );

			$element->start_controls_tab(
				'normalhover_buaal226_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_bto20726',
					'types'    => array( 'classic', 'gradient' ),
					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title',
				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_mjrhas26',
					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title',
				)
			);

			$element->add_control(
				'dimension_rflwys26',
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

					'selectors'  => array( '{{WRAPPER}} .ha-infobox-body .ha-infobox-title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),

				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_w0f33t26',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title',

				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_yfq4f226',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title',

				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_buaal226_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_c2egvu26',
					'types'    => array( 'classic', 'gradient' ),

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title:hover',

				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_vndhi326',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title:hover',

				)
			);

			$element->add_control(
				'dimension_bdjb1n26',
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

					'selectors'  => array( '{{WRAPPER}} .ha-infobox-body .ha-infobox-title:hover' => ': {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),

				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_2ozxis26',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title:hover',

				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_n3ynlm26',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-title:hover',

				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->add_control(
				'rawhtml_cl1vlk26',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post( 'Description ' ),

					'show_label'  => false,
					'label_block' => true,

				)
			);

			$element->add_control(
				'divider_7fpw6726',
				array(
					'type' => Controls_Manager::DIVIDER,

				)
			);

			$element->start_controls_tabs( 'normalhover_tdb2a826', array() );

			$element->start_controls_tab(
				'normalhover_tdb2a826_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_nq66tz26',
					'types'    => array( 'classic', 'gradient' ),

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text',

				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_4fnmw126',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text',

				)
			);

			$element->add_control(
				'dimension_whupnj26',
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

					'selectors'  => array( '{{WRAPPER}} .ha-infobox-body .ha-infobox-text' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),

				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_v8e24o26',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text',

				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_psh51q26',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text',

				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_tdb2a826_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_group_control(
				Group_Control_Background::get_type(),
				array(
					'label'    => esc_html__( 'Background', 'captain-widgets-kit' ),
					'name'     => 'background_29jcmc26',
					'types'    => array( 'classic', 'gradient' ),

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text:hover',

				)
			);

			$element->add_group_control(
				Group_Control_Border::get_type(),
				array(
					'label'    => esc_html__( 'Border', 'captain-widgets-kit' ),
					'name'     => 'border_h9p5zl26',
					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text:hover',
				)
			);

			$element->add_control(
				'dimension_53v12j26',
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
					'selectors'  => array( '{{WRAPPER}} .ha-infobox-body .ha-infobox-text:hover' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}' ),
				)
			);

			$element->add_group_control(
				Group_Control_Text_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Text Shadow', 'captain-widgets-kit' ),
					'name'     => 'textshadow_io770e26',
					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text:hover',
				)
			);

			$element->add_group_control(
				Group_Control_Box_Shadow::get_type(),
				array(
					'label'    => esc_html__( 'Box Shadow', 'captain-widgets-kit' ),
					'name'     => 'boxshadow_yav99f26',

					'selector' => '{{WRAPPER}} .ha-infobox-body .ha-infobox-text:hover',

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
		 * @param object $element Elementor element.
		 * @since 0.0.1
		 */
		public function captwiki_render_content( $content, $element ) {

			if ( 'ha-infobox' !== $element->get_name() ) {
				return;
			}

			$settings = $element->get_settings_for_display();

			return $content;
		}
	}

	Captwiki_Info_Box_Settings_Y5j1q126::get_instance();
}
