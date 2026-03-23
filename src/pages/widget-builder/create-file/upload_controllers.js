export const upload_controllers = (controller) => {

    const upload_conditions = (controller) => {
        if (!controller) {
            return;
        }

        var condition = ""
        var condition_data = ""
        if (controller.conditions == true) {
            controller.condition_value.values.map((cd_data) => {
                if (cd_data.name == "" || cd_data.operator == "") {
                } else {
                    condition_data += `array('name' => '${cd_data.name}', 'operator' => '${cd_data.operator}', 'value' => '${cd_data.value}'),`
                }
            })
            if (condition_data == "") {
                condition = "";
            } else {
                condition += `'conditions' => array(
								'relation' => '${controller.condition_value.relation}',
								'terms' => [
									${condition_data}
									],
								),`
            }
        }
        return condition;

    }

    const sanitizeHTML = (string) => {
        if (!string) {
            return '';
        }

        let updatedString = string.replace(/'/g, "\\'");
        return updatedString;
    }

    if (!controller.name) {
        return;
    }

    let controller_code = '';

    if ('text' == controller.type) {

        var selector_data = ``;

        if (controller.selector_type == "basic") {
            if (controller.selectors != "") {
                selector_data += `'selectors' => array(`

                controller.selector_value ?
                    selector_data += `'${controller.selectors}' => '${controller.selector_value} : ${controller.property_value}'`
                    :
                    selector_data += `'${controller.selectors}' => '${controller.property_value}'`

                selector_data += `),`
            }
        } else if (controller.selector_type == "advanced" && controller.selectors_advanced != "") {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "type" => Controls_Manager::TEXT,
                ${controller?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
                ${controller.defaultValue ? `'default' => esc_html__( '${controller.defaultValue}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.placeHolder ? `'placeholder' => esc_html__( '${controller.placeHolder}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.input_type ? `'input_type' => '${controller.input_type}',` : ''} 
                ${selector_data}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${controller.dynamic == true ? `"dynamic" => [
                    "active" => true,
                ],` : ''}
                ${upload_conditions(controller)}
            ]);
        `;
    } else if ('number' == controller.type) {

        var selector_data = ``;

        if (controller.selector_type == "basic" && controller.selectors != '') {
            selector_data += `'selectors' => array(`
            controller.selector_value ?
                selector_data += `'${controller.selectors}' => '${controller.selector_value}: ${controller.property_value}'`
                :
                selector_data += `'${controller.selectors}' => '${controller.property_value}'`
            selector_data += `),`
        } else if (controller.selector_type == "advanced" && controller.selectors_advanced != '') {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "type" => Controls_Manager::NUMBER,
                ${controller.number_setting.min ? `'min' => ${controller.number_setting.min},` : ''}
                ${controller.number_setting.max ? `'max' => ${controller.number_setting.max},` : ''}
                ${controller.number_setting.step ? `'step' => ${controller.number_setting.step},` : ''}
                ${controller.defaultValue ? `'default' => esc_html__( '${controller.defaultValue}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.placeHolder ? `'placeholder' => esc_html__( '${controller.placeHolder}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${selector_data}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${controller.dynamic == true ? `"dynamic" => [
                    "active" => true,
                ],` : ''}
                ${upload_conditions(controller)}
        ]);
    `;
    } else if ('textarea' == controller.type) {

        var selector_data = ``;

        if (controller.selector_type == "basic" && controller.selectors != "") {
            selector_data += `'selectors' => array(`
            controller.selector_value ?
                selector_data += `'${controller.selectors}' => '${controller.selector_value}: ${controller.property_value}'`
                :
                selector_data += `'${controller.selectors}' => '${controller.property_value}'`
            selector_data += `),`
        } else if (controller.selector_type == "advanced" && controller.selectors_advanced != "") {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::TEXTAREA,
                ${controller?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.defaultValue ? `'default' => esc_html__( '${controller.defaultValue}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.placeHolder ? `'placeholder' => esc_html__( '${controller.placeHolder}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${selector_data}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                'rows' => '${controller.rows}',
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${controller.dynamic === true ? `'dynamic' => array(
                    'active' => ${controller.dynamic},
                ),` : ''}
                ${upload_conditions(controller)}
                ]);
    `;
    } else if ('switcher' == controller.type) {
        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::SWITCHER,
                ${controller.label_on ? `'label_on' => esc_html__( '${controller.label_on}', '${captwiki_data.text_domain}' )` : ''},
                ${controller.label_off ? `'label_off' => esc_html__( '${controller.label_off}', '${captwiki_data.text_domain}' )` : ''},
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.return_value ? `'return_value' => esc_html__( '${controller.return_value}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.defaultValue ? `'default' => ${controller.defaultValue},` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${upload_conditions(controller)}
                ]);
    `;
    } else if ('select' == controller.type) {

        let options = controller.options;
        var opt = ""

        options.map((data) => {
            opt += `'${data.value}'  => esc_html__( '${data.label}', '${captwiki_data.text_domain}' ),`
        })

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::SELECT,
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.defaultValue ? `'default' => '${controller.defaultValue}',` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${options.length > 0 ? `'options' => array( ${opt} ),` : ''}
                ${upload_conditions(controller)}
                ]);
    `;
    } else if ('color' == controller.type) {
        var selector_data = ``;

        if (controller.selector_type == "basic" && controller.selectors != "") {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${controller.selectors}' => '${controller.selector_value}: {{VALUE}}',`
            selector_data += `),`
        } else if (controller.selector_type == "advanced" && controller.selectors_advanced != "") {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::COLOR,
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.defaultValue ? `'default' => '${controller.defaultValue}',` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${controller.alpha === true ? `'alpha' => ${controller.alpha},` : ''}
                ${selector_data}
                ${controller.global === true ? `'global' => array(
                    'active' => ${controller.global},
                ),` : ''}
                ${upload_conditions(controller)}
                ]);
    `;
    } else if ('typography' == controller.type) {
        var selector_data = ``;

        if (controller.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${controller.selector}',`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_group_control"}(
                Group_Control_Typography::get_type(),
                 [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'name' => '${controller.name}',
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${selector_data}
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('textshadow' == controller.type) {
        var selector_data = ``;

        if (controller.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${controller.selector}',`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_group_control"}(
                Group_Control_Text_Shadow::get_type(),
                 [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "name" => '${controller.name}',
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${selector_data}
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('boxshadow' == controller.type) {
        var selector_data = ``;

        if (controller.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${controller.selector}',`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_group_control"}(
                Group_Control_Box_Shadow::get_type(),
                 [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "name" => '${controller.name}',
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${selector_data}
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('border' == controller.type) {
        var selector_data = ``;

        if (controller.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${controller.selector}',`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_group_control"}(
                Group_Control_Border::get_type(),
                 [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "name" => '${controller.name}',
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${selector_data}
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('background' == controller.type) {
        var selector_data = ``;

        if (controller.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${controller.selector}',`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_group_control"}(
                Group_Control_Background::get_type(),
                 [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "name" => '${controller.name}',
                'types' => ['${controller.types.join("','")}'],
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${selector_data}
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('cssfilter' == controller.type) {
        var selector_data = ``;

        if (controller.selector != "") {
            selector_data += `'selector' => '{{WRAPPER}} ${controller.selector}',`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_group_control"}(
                \\Elementor\\Group_Control_Css_Filter::get_type(),
                 [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "name" => '${controller.name}',
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${selector_data}
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('dimension' == controller.type) {

        var selector_data = ``;
        let size_units = ``;
        let default_val = ``;

        if (controller.selector_type == "basic" && controller.selectors != "") {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${controller.selectors}' => '${controller.selector_value}: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',`
            selector_data += `),`
        } else if (controller.selector_type == "advanced" && controller.selectors_advanced != "") {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        if (controller.dimension_units) {
            controller.dimension_units.map((unit) => {
                size_units += `'${unit}',`
            })
        }

        if (controller.dimension_defaultValue) {
            if (controller.dimension_defaultValue.isLinked == true) {
                default_val = `array(
                    'top' => '${controller.dimension_defaultValue.top}',
                    'right' => '${controller.dimension_defaultValue.top}',
                    'bottom' => '${controller.dimension_defaultValue.top}',
                    'left' => '${controller.dimension_defaultValue.top}',
                    'unit' => '${controller.dimension_defaultValue.unit}',
                    'isLinked' => '${controller.dimension_defaultValue.isLinked}',
                )`
            } else if (controller.dimension_defaultValue.isLinked == false) {
                default_val = `array(
                    'top' => '${controller.dimension_defaultValue.top}',
                    'right' => '${controller.dimension_defaultValue.right}',
                    'bottom' => '${controller.dimension_defaultValue.bottom}',
                    'left' => '${controller.dimension_defaultValue.left}',
                    'unit' => '${controller.dimension_defaultValue.unit}',
                    'isLinked' => '${controller.dimension_defaultValue.isLinked}',
                )`
            }
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::DIMENSIONS,
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                'size_units' => array(${size_units}),
                ${default_val ? `'default' => ${default_val},` : ''}
                ${controller.responsive == true ?
                `'tablet_default' => ${default_val},
                'mobile_default' => ${default_val},
                'widescreen_default' => ${default_val},`
                : ''
            }
                ${selector_data}
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('divider' == controller.type) {

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                'type' => Controls_Manager::DIVIDER,
                ${upload_conditions(controller)}
                ]
            );
    `;
    } else if ('normalhover' == controller.type) {

        let fields = '';

        if (Array.isArray(controller.fields) && controller.fields.length > 0 && Array.isArray(controller.nha_array) && controller.nha_array.length > 0) {
            controller?.nha_array.map((item, index) => {
                fields += `
            $element->start_controls_tab('${controller.name}_${item.value}_tab', array(
                    'label' => esc_html__( '${item?.label ?? ''}', '${captwiki_data.text_domain}' ),
                )
            );\n`

                controller?.fields?.map((field_controller) => {
                    if (field_controller?.key == item.value) {
                        fields += upload_controllers(field_controller);
                    }
                })

                fields += `
            $element->end_controls_tab();\n`
            })
        }

        controller_code += `
            $element->start_controls_tabs("${controller.name}", [${upload_conditions(controller)}]);
                ${fields}
            $element->end_controls_tabs();
        `
    } else if ('choose' == controller.type) {

        var selector_data = ``;
        var opt = ""

        if (Array.isArray(controller.align_option) && controller.align_option.length > 0) {
            opt += `'options' => array(`
            controller.align_option.map((data) => {
                opt += `
                        "${data.align_value}" => array(
                            'title' => esc_html__( '${data.align_label}', '${captwiki_data.text_domain}' ),
                            'icon' => '${data.align_icon}',
                        ),`
            })
            opt += `),`
        }

        if (controller.selector_type == "basic" && controller.selectors != "") {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${controller.selectors}' => '${controller.selector_value}: {{VALUE}}',`
            selector_data += `),`
        } else if (controller.selector_type == "advanced" && controller.selectors_advanced != "") {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::CHOOSE,
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.defaultValue ? `'default' => '${controller.defaultValue}',` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${opt}
                ${selector_data}
                ${upload_conditions(controller)}
                ]);
    `;
    } else if ('code' == controller.type) {

        var selector_data = ``;

        if (controller.selector_type == "basic" && controller.selectors && controller.selectors.trim() != '') {
            selector_data += `'selectors' => array(`
            selector_data += `'{{WRAPPER}} ${controller.selectors}' => '{{VALUE}}'`
            selector_data += `),`
        } else if (controller.selector_type == "advanced" && controller.selectors_advanced && controller.selectors_advanced.trim() != '') {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::CODE,
                ${controller?.ai_support != true ? `'ai'   => [ 'active' => false ],` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.defaultValue ? `'default' => esc_html__( '${controller.defaultValue}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                'language' => '${controller.language}',
                ${selector_data}
                ${upload_conditions(controller)}
                ]);
    `;
    } else if ('slider' == controller.type) {
        var selector_data = ``;
        var size_units = ``;
        var range = ``;
        var default_value = ``;

        if (controller.size_units != "" && controller.size_units != undefined) {
            controller.size_units.map((unit) => {
                if (unit.checked == true) {
                    size_units += `"${unit.type}",`;
                    range += `'${unit.type}' => array(
                        'min' => ${(unit?.min || unit?.min === 0) ? unit?.min : '0'},
                        'max' => ${(unit?.max || unit?.max === 0) ? unit?.max : '1000'},
                        'step' => ${(unit?.step || unit?.step === 0) ? unit?.step : '1'},
                    ),`
                }
            })
            if (size_units && range) {
                size_units = `'size_units' => array( ${size_units} ),`
                range = `'range' => array(${range}),`
            } else {
                size_units = ``;
                range = ``;
            }
        }

        if (controller.defaultValue != "" && controller.defaultValue != undefined) {
            if (size_units) {
                default_value += `array(
                                    'unit' => '${controller.defaultValue.unit}',
                                    'size' => ${controller.defaultValue.value ? controller.defaultValue.value : "''"},
                                )`
            } else {
                default_value += `array(
                                    'size' => ${controller.defaultValue.value ? controller.defaultValue.value : "''"},
                                )`

            }
        }

        if (controller.selector_type == "basic" && controller.selectors != "") {
            selector_data += `'selectors' => array(`
            if (controller.selector_value) {
                if (controller && controller.show_unit == true && size_units) {
                    selector_data += `'{{WRAPPER}} ${controller.selectors}' => '${controller.selector_value}: ${controller.property_value} {{SIZE}}{{UNIT}};',),`
                } else {
                    selector_data += `'{{WRAPPER}} ${controller.selectors}' => '${controller.selector_value}: ${controller.property_value} {{SIZE}};',),`
                }
            } else {
                if (controller && controller.show_unit == true && size_units) {
                    selector_data += `'{{WRAPPER}} ${controller.selectors}' => '${controller.property_value} {{SIZE}}{{UNIT}};',),`
                } else {
                    selector_data += `'{{WRAPPER}} ${controller.selectors}' => '${controller.property_value} {{SIZE}};',),`
                }
            }

        } else if (controller.selector_type == "advanced" && controller.selectors_advanced != "") {
            selector_data += `'selectors' => array(${controller.selectors_advanced}),`
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                'type' => Controls_Manager::SLIDER,
                ${size_units}
                ${range}
                ${default_value ? `'default' => ${default_value},` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.responsive == true ?
                `'tablet_default' => ${default_value},
                'mobile_default' => ${default_value},
                'widescreen_default' => ${default_value},`
                : ''
            }
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${selector_data}
                ${controller.global === true ? `'global' => array(
                    'active' => ${controller.global},
                ),` : ''}
                ${upload_conditions(controller)}
                ]);
    `;
    } else if ('hover_animation' == controller.type) {

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "type" => Controls_Manager::HOVER_ANIMATION,
                ${controller.defaultValue ? `'default' => esc_html__( '${controller.defaultValue}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${upload_conditions(controller)}
            ]);
        `;
    } else if ('exit_animation' == controller.type) {

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "type" => Controls_Manager::EXIT_ANIMATION,
                'prefix_class' => 'animated ',
                ${controller.defaultValue ? `'default' => esc_html__( '${controller.defaultValue}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${upload_conditions(controller)}
            ]);
        `;
    } else if ('animation' == controller.type) {

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "type" => Controls_Manager::ANIMATION,
                'prefix_class' => 'animated ',
                ${controller.defaultValue ? `'default' => esc_html__( '${controller.defaultValue}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${upload_conditions(controller)}
            ]);
        `;
    } else if ('rawhtml' == controller.type) {

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "type" => Controls_Manager::RAW_HTML,
                ${controller.defaultValue ? `'raw' => wp_kses_post( '${sanitizeHTML(controller.defaultValue)}' ),` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.controlClass ? `'content_classes' => '${controller.controlClass}',` : ''}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${upload_conditions(controller)}
            ]);
        `;
    } else if ('preview' == controller.type) {

        let preview_label = `'. esc_html__( 'Update Preview Changes', '${captwiki_data.text_domain}' ) .'`;
        let preview_button = `'. esc_html__( 'Apply', '${captwiki_data.text_domain}' ) .'`;

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
            'label' => '<div class="elementor-update-preview" style="margin: 0;">
                                        <div class="elementor-update-preview-title">${preview_label}</div>
                                            <div class="elementor-update-preview-button-wrapper">
                                                <button class="elementor-update-preview-button elementor-button"">
                                                    ${preview_button}
                                                </button>
                                            </div>
                                        </div>',
                    'type'  => Controls_Manager::RAW_HTML,
            ]);
        `;
    } else if ('url' == controller.type) {

        let options_array = [];

        if (controller.url_options && controller.url_options == true && controller.url_options_array && controller.url_options_array.length > 0) {
            options_array += `array(`
            controller.url_options_array.map((options) => {
                options_array += `'${options}',`
            })
            options_array += `)`
        } else {
            options_array = false;
        }

        controller_code += `
            $element->${controller.responsive == true ? "add_responsive_control" : "add_control"}("${controller.name}", [
                "label" => esc_html__("${controller.label}", "${captwiki_data.text_domain}"),
                "type" => Controls_Manager::URL,
                'options' => ${options_array},
                'default' => array(
                    'url' => '${controller.defaultValue}',
                    'is_external' => ${controller.is_external},
                    'nofollow' => ${controller.nofollow},
                    'custom_attributes' => '${controller.custom_attributes}',
                    ),
                ${controller.placeHolder ? `'placeholder' => esc_html__( '${controller.placeHolder}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller?.description ? `'description' => esc_html__( '${controller.description}', '${captwiki_data.text_domain}' ),` : ''}
                ${controller.showlabel === true ? '' : `'show_label' => ${controller.showlabel},`}
                ${controller.labelBlock === false ? '' : `'label_block' => ${controller.labelBlock},`}
                ${controller.separator !== 'default' ? `'separator' => '${controller.separator}',` : ''}
                ${controller.controlClass ? `'classes' => '${controller.controlClass}',` : ''}
                ${controller.dynamic == true ? `"dynamic" => [
                    "active" => true,
                ],` : ''}
                ${upload_conditions(controller)}
            ]);
        `;
    }

    return controller_code;

}