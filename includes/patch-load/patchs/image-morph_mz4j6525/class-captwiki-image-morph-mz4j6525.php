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
if ( ! class_exists( 'Captwiki_Image_Morph_Mz4j6525' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since 0.0.1
	 */
	class Captwiki_Image_Morph_Mz4j6525 {

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
			add_action( 'elementor/element/image/section_image/after_section_end', array( $this, 'captwiki_register_controls' ), 10, 2 );
			add_filter( 'elementor/widget/render_content', array( $this, 'captwiki_render_content' ), 10, 2 );
		}

		/**
		 * Define the core functionality of the plugin.
		 *
		 * @param object $element Elementor element.
		 * @since 0.0.1
		 */
		public function captwiki_register_controls( $element ) {

			$element->start_controls_section(
				'section-9uwwub25',
				array(
					'label'   => esc_html__( 'Image Morph', 'captain-widgets-kit' ),
					'tab'     => Controls_Manager::TAB_CONTENT,
					'classes' => 'captwiki-el-section',
				)
			);

			$element->start_controls_tabs( 'normalhover_td0m9225', array() );

			$element->start_controls_tab(
				'normalhover_td0m9225_normal_tab',
				array(
					'label' => esc_html__( 'Normal', 'captain-widgets-kit' ),
				)
			);

			$element->add_control(
				'textarea_44rdvs25',
				array(
					'label'     => esc_html__( 'Clip Path', 'captain-widgets-kit' ),
					'type'      => Controls_Manager::TEXTAREA,
					'ai'        => array( 'active' => false ),
					'selectors' => array( '.craft-el-image img' => '{{VALUE}}' ),
					'rows'      => '3',
				)
			);

			$element->add_control(
				'rawhtml_5xy55q25',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post(
						'<p style="font-size: 11px; font-style: italic; line-height: 1.4; color: #818A96;"> Enter the full clip-path property! See the copy-paste examples at <a href="https://bennettfeely.com/clippy/" target="_blank">Clippy</a> </p>'
					),
					'show_label'  => false,
					'label_block' => true,
				)
			);

			$element->end_controls_tab();

			$element->start_controls_tab(
				'normalhover_td0m9225_hover_tab',
				array(
					'label' => esc_html__( 'Hover', 'captain-widgets-kit' ),
				)
			);

			$element->add_control(
				'textarea_1389zw25',
				array(
					'label'     => esc_html__( 'Clip Path', 'captain-widgets-kit' ),
					'type'      => Controls_Manager::TEXTAREA,
					'ai'        => array( 'active' => false ),
					'selectors' => array( '.craft-el-image img:hover' => '{{VALUE}}' ),
					'rows'      => '3',
				)
			);

			$element->add_control(
				'rawhtml_i13rv325',
				array(
					'label'       => esc_html__( 'Raw Html', 'captain-widgets-kit' ),
					'type'        => Controls_Manager::RAW_HTML,
					'raw'         => wp_kses_post(
						'<p style="font-size: 11px; font-style: italic; line-height: 1.4; color: #818A96;"> Enter the full clip-path property! See the copy-paste examples at <a href="https://bennettfeely.com/clippy/" target="_blank">Clippy</a> </p>'
					),
					'show_label'  => false,
					'label_block' => true,
				)
			);

			$element->end_controls_tab();

			$element->end_controls_tabs();

			$element->add_control(
				'switcher_no3es525',
				array(
					'label'        => esc_html__( 'Hover Animate?', 'captain-widgets-kit' ),
					'type'         => Controls_Manager::SWITCHER,
					'label_on'     => esc_html__( 'Yes', 'captain-widgets-kit' ),
					'label_off'    => esc_html__( 'No', 'captain-widgets-kit' ),
					'return_value' => esc_html__( 'Yes', 'captain-widgets-kit' ),
				)
			);

			$element->add_responsive_control(
				'slider_h0d8g325',
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
					'selectors'          => array( '{{WRAPPER}}.craft-el-image img' => 'transition: clip-path {{SIZE}}s ease 0s' ),
					'conditions'         => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_no3es525',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->add_control(
				'divider_r0l0f325',
				array(
					'type'       => Controls_Manager::DIVIDER,
					'conditions' => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_no3es525',
								'operator' => '==',
								'value'    => 'Yes',
							),
						),
					),
				)
			);

			$element->add_control(
				'animation_k6vb9a25',
				array(
					'label'        => esc_html__( 'Entrance Animation', 'captain-widgets-kit' ),
					'type'         => Controls_Manager::ANIMATION,
					'prefix_class' => 'animated ',
					'label_block'  => true,
					'conditions'   => array(
						'relation' => 'or',
						'terms'    => array(
							array(
								'name'     => 'switcher_no3es525',
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
		 * Render content.
		 *
		 * @param string $content Content.
		 * @param object $element Elementor element.
		 * @since 0.0.1
		 */
		public function captwiki_render_content( $content, $element ) {

			if ( 'image' !== $element->get_name() ) {
				return; }

			$element_id = $element->get_id();

			$element->add_render_attribute( '_wrapper', 'class', 'craft-el-image' );

			return $content;
		}
	}

	Captwiki_Image_Morph_Mz4j6525::get_instance();
}
