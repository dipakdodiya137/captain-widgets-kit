import axios from 'axios';
import { UniqueID } from '../../../global/elements';
import { upload_controllers } from './upload_controllers';

const ElementorFile = async (section_data, widget_info, widget_code = {}, type = 'create') => {

	var version_num = cwk_data.CWK_PD_VERSION;

	const handleFileName = (filename) => {
		let newFileName = filename.toLowerCase()?.replace(/ /g, '-');
		return `${newFileName}_${widget_info.id}`;
	}

	const handlePhpName = (name) => {
		let newPhpName = name.toLowerCase()?.replace(/ /g, '_');
		return `${newPhpName}_${widget_info.id}`;
	}

	const upload_section = () => {
		const section_panels = [
			{ name: 'content', tabName: 'TAB_CONTENT' },
			{ name: 'style', tabName: 'TAB_STYLE' },
			{ name: 'advanced', tabName: 'TAB_ADVANCED' },
			{ name: 'layout', tabName: 'TAB_LAYOUT' },
		]

		var upload_data = '';
		section_panels.map((panel) => {
			if (Array.isArray(section_data?.[panel.name]) && section_data?.[panel.name]?.length > 0) {
				section_data?.[panel.name].map((inner_section) => {
					if (inner_section?.isExternal || inner_section?.isExternel) {
						return;
					}
					upload_data += `
				$element->start_controls_section("${inner_section?.key}", [
					"label" => esc_html__("${inner_section?.name}", "${cwk_data.text_domain}"),
					"tab" => Controls_Manager::${panel.tabName},
					'classes' => 'cwk-el-section',
				]);`

					if (Array.isArray(inner_section.controllers) && inner_section.controllers.length > 0) {
						inner_section.controllers.map((controller) => {
							upload_data += upload_controllers(controller);
						})
					}

					upload_data += `
				$element->end_controls_section();`
				})

			}
		})

		return upload_data;
	};

	const getEffectApply = (type) => {

		if ('php' == type) {
			if (!(widget_code?.php) || widget_code?.php.trim() == '') {
				return '';
			}

			if (widget_info?.effect_type == 'widget') {
				return `add_filter( 'elementor/widget/render_content', [ $this, 'cwk_render_content' ], 10, 2 );`
			} else if (widget_info?.effect_type == 'container') {
				return '';
				// return `add_filter( 'elementor/frontend/container/after_render', [ $this, 'cwk_render_content' ], 10 );`
			} else if (widget_info?.effect_type == 'section') {
				return `add_filter( 'elementor/element/section/before_render', [ $this, 'cwk_render_content' ], 10, 1 );`
			} else if (widget_info?.effect_type == 'column') {
				return `add_filter( 'elementor/element/column/before_render', [ $this, 'cwk_render_content' ], 10, 1 );`
			}

		} else if ('after' == type) {
			if (!(widget_code?.php_after) || widget_code?.php_after.trim() == '') {
				return '';
			}

			if (widget_info?.effect_type == 'widget') {
				return `add_action( 'elementor/frontend/widget/after_render', [ $this, 'cwk_after_render' ], 10, 1 );`;
			} else if (widget_info?.effect_type == 'container') {
				return `add_action( "elementor/frontend/container/after_render", [$this, 'cwk_after_render'], 10, 1);`;
			} else if (widget_info?.effect_type == 'section') {
				return `add_action( "elementor/frontend/section/after_render", [$this, 'cwk_after_render'], 10, 1);`;
			} else if (widget_info?.effect_type == 'column') {
				return `add_action( "elementor/frontend/column/after_render", [$this, 'cwk_after_render'], 10, 1);`;
			} else {
				return '';
			}
		} else if ('before' == type) {

			if (!(widget_code?.php_before) || widget_code?.php_before.trim() == '') {
				return '';
			}

			if (widget_info?.effect_type == 'widget') {
				return `add_action( 'elementor/frontend/widget/before_render', [ $this, 'cwk_before_render' ], 10, 1 );`;
			} else if (widget_info?.effect_type == 'container') {
				return `add_action( "elementor/frontend/container/before_render", [$this, 'cwk_before_render'], 10, 1);`;
			} else if (widget_info?.effect_type == 'section') {
				return `add_action( "elementor/frontend/section/before_render", [$this, 'cwk_before_render'], 10, 1);`;
			} else if (widget_info?.effect_type == 'column') {
				return `add_action( "elementor/frontend/column/before_render", [$this, 'cwk_before_render'], 10, 1);`;
			} else {
				return '';
			}

		}

		return '';
	}

	const getEffectCode = (type) => {

		const return_check = () => {
			var return_condition = '';

			if (widget_info?.effect_type == 'widget') {
				return_condition = `if ( '${widget_info?.selected_widget?.id}' !== $element->get_name() ) { return;}`;
			} else if (widget_info?.effect_type == 'container') {
				return_condition = `if ( 'container' !== $element->get_name() ) { return; }`;
			}

			return return_condition;
		}

		if ('php' == type) {

			if (!(widget_code?.php) || widget_code?.php.trim() == '' || widget_info?.effect_type == 'container') {
				return '';
			}

			let effect_code = `
			public function cwk_render_content( $content, $element ) {

				${return_check()}

				${widget_code?.php}

				return $content;
			}
			`

			return effect_code;

		} else if ('after' == type) {

			if (!(widget_code?.php_after) || widget_code?.php_after.trim() == '') {
				return '';
			}

			let effect_code = `
			public function cwk_after_render( $element ) {

				${return_check()}

				${widget_code?.php_after}
			}` ;

			return effect_code;

		} else if ('before' == type) {

			if (!(widget_code?.php_before) || widget_code?.php_before.trim() == '') {
				return '';
			}

			let effect_code = `
			public function cwk_before_render( $element ) {

				${return_check()}

				${widget_code?.php_before}
			}` ;

			return effect_code;

		}

		return '';
	}

	const getCssApply = (type) => {

		if (!widget_code?.css?.trim() || !type) {
			return '';
		}

		if (type == 'construct') {
			return `add_action( 'wp_enqueue_scripts', array( $this, 'cwk_enqueue_style' ) );`;
		} else if (type === 'enqueue') {
			return `public function cwk_enqueue_style(){
			$upload_dir = wp_upload_dir();

			$custom_css_url = trailingslashit( $upload_dir['baseurl'] ) . 'captain-widgets-kit/${handleFileName(widget_info.name)}/${handleFileName(widget_info.name)}.css';
			wp_enqueue_style( 'cwk-${UniqueID()}-${handleFileName(widget_info.name)}', $custom_css_url, array(), time() );

			}`;
		}

	}

	const getJsApply = (type) => {

		if (!widget_code?.js?.trim() || !type) {
			return '';
		}

		if (type === 'construct') {
			return `add_action( 'wp_enqueue_scripts', array( $this, 'cwk_enqueue_script' ) );`;
		} else if (type === 'enqueue') {
			return `public function cwk_enqueue_script(){
			$upload_dir = wp_upload_dir();

			$custom_js_url = trailingslashit( $upload_dir['baseurl'] ) . 'captain-widgets-kit/${handleFileName(widget_info.name)}/${handleFileName(widget_info.name)}.js';
			wp_enqueue_script('cwk-${UniqueID()}-${handleFileName(widget_info.name)}', $custom_js_url, array(), time(), true );
			}`;
		}

	}

	const createHook = () => {
		let cwk_sections = ['content', 'style', 'advanced']


		if (widget_info?.effect_type == 'widget') {

			var external_section_name = '';

			if (!external_section_name) {
				cwk_sections.map((section) => {
					if (Array.isArray(section_data[section]) && section_data[section]?.length > 0) {
						section_data[section]?.map((inner_section) => {
							if (inner_section?.isExternal && !external_section_name) {
								external_section_name = `${inner_section?.key}`;
							}
						})
					}
				})
			}

			if (external_section_name) {
				return `add_action( 'elementor/element/${widget_info?.selected_widget?.id}/${external_section_name}/after_section_end', array( $this, 'cwk_register_controls' ), 10, 2 );`
			} else if (widget_info?.selected_widget?.external_sec_id) {
				return `add_action( 'elementor/element/${widget_info?.selected_widget?.id}/${widget_info?.selected_widget?.external_sec_id}/after_section_end', array( $this, 'cwk_register_controls' ), 10, 2 );`
			} else {
				return `add_action( 'elementor/element/${widget_info?.selected_widget?.id}/section_style/after_section_end', array( $this, 'cwk_register_controls' ), 10, 2 );`
			}

		} else if (widget_info?.effect_type == 'container') {
			return `add_action( 'elementor/element/container/section_layout/after_section_end', array( $this, 'cwk_register_controls' ), 10, 2 );`
		} else if (widget_info?.effect_type == 'section') {
			return `add_action( 'elementor/element/section/section_layout/after_section_end', array( $this, 'cwk_register_controls' ), 10, 2 );`
		} else if (widget_info?.effect_type == 'column') {
			return `add_action( 'elementor/element/column/section_advanced/after_section_end', array( $this, 'cwk_register_controls' ), 10, 2 );`
		} else if (widget_info?.effect_type == 'common') {
			return `add_action( 'elementor/element/column/section_advanced/after_section_end', array( $this, 'cwk_register_controls' ), 10, 2 );`;
		}

		return '';
	}

	let php_variable = `<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @since ${version_num}
 */

use Elementor\\Controls_Manager;
use Elementor\\Widget_Base;
use Elementor\\Plugin;
use Elementor\\Utils;
use Elementor\\Group_Control_Typography;
use Elementor\\Group_Control_Border;
use Elementor\\Group_Control_Background;
use Elementor\\Group_Control_Box_Shadow;
use Elementor\\Group_Control_Text_Shadow;
use Elementor\\Group_Control_Image_Size;

/**
 * Exit if accessed directly.
 * 
 * @since ${version_num}
 * */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Cwk_${handlePhpName(widget_info.name)}' ) ) {

	/**
	 * It is Main Class
	 *
	 * @since ${version_num}
	 */
	class Cwk_${handlePhpName(widget_info.name)} {

		/**
		 * Member Variable
		 *
		 * @since ${version_num}
		 */
		private static $instance;

		/**
		 * Initiator
		 * 
		 * @since ${version_num}
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
		 * @since ${version_num}
		 */
		public function __construct() {

			${createHook()}
			${getCssApply('construct')}
			${getJsApply('construct')}
			${getEffectApply('php')}
			${getEffectApply('after')}
			${getEffectApply('before')}
		}
		
		${getCssApply('enqueue')}

		${getJsApply('enqueue')}

		/**
		 * Define the core functionality of the plugin.
		 * 
		 * @since ${version_num}
		 */
		public function cwk_register_controls( $element, $section_id )
		{
			${upload_section()}
		}

		${getEffectCode('php')}
		${getEffectCode('after')}
		${getEffectCode('before')}

	}

	Cwk_${handlePhpName(widget_info.name)}::get_instance();
}`;


	let encoded_data = (data) => {
		if (data) {
			return btoa(unescape(encodeURIComponent(data)))
		}
		return '';
	}

	let new_section_data = {};

	const section_panels = ['content', 'style', 'advanced', 'layout']

	let updated_widget_info = { ...widget_info }

	section_panels.map((panel) => {
		if (Array.isArray(section_data[panel]) && section_data[panel].length > 0) {
			new_section_data[panel] = section_data[panel].filter((data) => !data.isExternal)

			if (updated_widget_info?.effect_type == 'widget' && !updated_widget_info.selected_widget?.external_sec_id) {
				const external_section = section_data[panel].find((data) => data.isExternal)

				if (external_section) {
					updated_widget_info.selected_widget = { ...updated_widget_info.selected_widget, "external_sec_id": external_section.key, }
				}
			}
		}

	})

	let updated_section_data = { ...section_data, ...new_section_data }

	if (type === 'create') {
		updated_widget_info.created_at = new Date().toISOString();
	} else if (type === 'update') {
		updated_widget_info.updated_at = new Date().toISOString();
	}

	let json_data = {
		widget_info: updated_widget_info,
		section: updated_section_data,
		external_link: '',
		widget_code: widget_code,
	}

	let form = new FormData();
	form.append('action', 'cwk_dashboard_ajax_call');
	form.append('type', 'set_create_file');
	form.append('nonce', cwk_data.cwk_nonce);
	form.append('file_name', handleFileName(widget_info.name));
	form.append('folder_name', handleFileName(widget_info.name));
	form.append('elementor_php_file', encoded_data(php_variable));
	form.append('elementor_js', encoded_data(widget_code?.js));
	form.append('elementor_css', encoded_data(widget_code?.css));
	form.append('json_file', encoded_data(JSON.stringify(json_data)));

	var response = await axios.post(cwk_data.ajax_url, form);
	return response;
}

export default ElementorFile
