import { useState } from 'react'
import CodeEditor from '../../../components/code-editor/code-editor.jsx';
import './fields.scss';
import { useDispatch, useSelector } from 'react-redux';
import { handleSectionData } from '../../../redux/slice.jsx';
import Tooltip from '../../../components/tooltip/tooltip.jsx';
import Switcher from '../../../components/switcher/switcher.jsx';
import Dropdown from '../../../global/dropdown/dropdown.jsx';
import Checkbox from '../../../components/input/checkbox/checkbox.jsx';
import Accordion from '../../../global/accordion/accordion.jsx';
import { Popup_structure } from '../../../global/popup/popup.jsx';
import { copyToClipboard } from '../../../global/elements.js';
import { handleToastMessage } from '../../../redux/slice.jsx';
import { __ } from '@wordpress/i18n';

const Fields = () => {

    const [showPopup, setShowPopup] = useState('');
    const section_data = useSelector((state) => state?.controller_section);
    const dispatch = useDispatch();
    const assets_path = cwk_data?.CWK_PD_ASSETS;
    var selected_controller = section_data?.[section_data?.active_tab]?.[section_data?.active_section]?.controllers?.[section_data?.active_controller];

    if (section_data?.active_field || section_data?.active_field === 0) {
        selected_controller = section_data?.[section_data?.active_tab]?.[section_data?.active_section]?.controllers?.[section_data?.active_controller]?.fields?.[section_data?.active_field];
    }

    const TooltipSvg = (<i className='cwk-i-information-1'></i>);

    const updateValue = (type, value) => {


        const empty_check = [];

        if ((empty_check.includes(type) && value.trim() == '') || section_data?.active_controller == undefined) {
            return;
        }

        const activeIndex = section_data.active_section ?? 0;

        let newLayout = [...section_data?.[section_data?.active_tab]];
        let activeSection = { ...newLayout[activeIndex] };
        var newControllers = [...activeSection.controllers];

        if (section_data?.active_field || section_data?.active_field === 0) {
            newControllers = newControllers.map((controller, cIndex) => {
                if (cIndex === section_data?.active_controller) {

                    const updatedFields = controller.fields.map((field, fieldIndex) => {
                        if (fieldIndex === section_data?.active_field) {
                            return { ...field, [type]: value };
                        }
                        return field;
                    });

                    return {
                        ...controller,
                        fields: updatedFields,
                    };
                }

                return controller;  // unchanged controller
            });
        } else {
            newControllers = newControllers.map((controller, cIndex) => {
                if (cIndex === section_data?.active_controller) {
                    return { ...controller, [type]: value };
                }
                return controller;
            });

        }

        activeSection.controllers = newControllers;
        newLayout[activeIndex] = activeSection;

        // let newLayout = section_data?.[section_data?.active_tab]?.map((section, index) => {

        //     if (index === activeIndex) {

        //         let newController = section.controllers.map((controller, cIndex) => {
        //             if (cIndex === props.index) {
        //                 return { ...controller, [type]: value };
        //             }
        //             return controller;
        //         })

        //         return { ...section, controllers: newController };
        //     }

        //     return section;
        // })

        const newReduxData = { ...section_data, [section_data?.active_tab]: newLayout };

        dispatch(handleSectionData(newReduxData));
    }

    const updateController = (controllerValue, valueType, value, index) => {

        if (selected_controller?.[controllerValue]) {
            var newValue = { ...selected_controller?.[controllerValue] };

            if (Array.isArray(selected_controller?.[controllerValue]) && (index || index === 0)) {
                newValue = [...selected_controller[controllerValue]];

                let newIndexValue = newValue[index];

                if (newIndexValue) {
                    let updatedObject = { ...newIndexValue };
                    updatedObject[valueType] = value;

                    newValue[index] = updatedObject;
                }
            } else {
                newValue = { ...newValue, [valueType]: value }
            }

            updateValue(controllerValue, newValue);
        }
    }

    const updateConditionValue = (valuesArray, index, keyToUpdate, newValue) => {
        var newValuesArray = [...valuesArray];

        let newIndexValue = newValuesArray[index];

        if (newIndexValue) {
            let updatedObject = { ...newIndexValue };
            updatedObject[keyToUpdate] = newValue;

            newValuesArray[index] = updatedObject;
        }

        updateController('condition_value', 'values', newValuesArray);
    };


    const getValue = (valueType) => {
        if (selected_controller?.type == 'dimension') {
            if (selected_controller?.dimension_defaultValue?.isLinked) {
                return selected_controller?.dimension_defaultValue?.top;
            } else {
                return selected_controller?.dimension_defaultValue?.[valueType];
            }
        } else if (selected_controller?.type == 'slider') {
            let unitData = selected_controller?.size_units?.find((unit) => unit.type == selected_controller?.defaultValue?.unit)?.[valueType];
            return unitData;
        }
    }

    const updateArray = (controllerValue, valueType, checked) => {
        var newValue = [...selected_controller?.[controllerValue]];

        if (checked) {
            newValue.push(valueType);
        } else {
            newValue = newValue.filter((item) => item !== valueType);
        }

        updateValue(controllerValue, newValue);
    }

    const field_condition = (typeArray) => {

        if (typeArray.includes('label') && selected_controller?.showlabel && selected_controller?.label != undefined) {
            return true;
        } else if (typeArray.includes('defaultValue') && selected_controller?.defaultValue != undefined) {
            return true;
        } else if (typeArray.includes('number_setting') && selected_controller?.number_setting != undefined) {
            return true;
        } else if (typeArray.includes('showlabel') && selected_controller?.showlabel != undefined) {
            return true;
        } else if (typeArray.includes('labelBlock') && selected_controller?.labelBlock != undefined && selected_controller?.showlabel) {
            return true;
        } else if (typeArray.includes('description') && selected_controller?.description != undefined) {
            return true;
        } else if (typeArray.includes('placeHolder') && selected_controller?.placeHolder != undefined) {
            return true;
        } else if (typeArray.includes('separator') && selected_controller?.separator != undefined) {
            return true;
        } else if (typeArray.includes('input_type') && selected_controller?.input_type != undefined) {
            return true;
        } else if (typeArray.includes('dynamic') && selected_controller?.dynamic != undefined) {
            return true;
        } else if (typeArray.includes('responsive') && selected_controller?.responsive != undefined) {
            return true;
        } else if (typeArray.includes('controlClass') && selected_controller?.controlClass != undefined) {
            return true;
        } else if (typeArray.includes('selector_value') && selected_controller?.selector_value != undefined && selected_controller?.selector_type == 'basic') {
            if (typeArray.includes('textarea') && (selected_controller?.type == 'textarea' || selected_controller?.type == 'text' || selected_controller?.type == 'number')) {
                return true;
            } else if (!(typeArray.includes('textarea')) && (selected_controller?.type !== 'textarea' && selected_controller?.type !== 'text' && selected_controller?.type !== 'number')) {
                return true;
            } else {
                return false;
            }
        } else if (typeArray.includes('selectors') && selected_controller?.selectors != undefined) {
            if (typeArray.includes('basic') && selected_controller?.selector_type == 'basic') {
                return true;
            } else if (typeArray.includes('advanced') && selected_controller?.selector_type == 'advanced') {
                return true;
            }
            return false;
        } else if (typeArray.includes('selector') && selected_controller?.selector != undefined) {
            return true;
        } else if (typeArray.includes('rows') && selected_controller?.rows != undefined) {
            return true;
        } else if (typeArray.includes('label_off') && typeArray.includes('label_on') && selected_controller?.label_off != undefined && selected_controller?.label_on != undefined) {
            return true;
        } else if (typeArray.includes('return_value') && selected_controller?.return_value != undefined) {
            return true;
        } else if (typeArray.includes('options') && selected_controller?.options != undefined) {
            return true;
        } else if (typeArray.includes('name') && selected_controller?.name != undefined) {
            return true;
        } else if (typeArray.includes('types') && Array.isArray(selected_controller?.types)) {
            return true;
        } else if (typeArray.includes('alpha') && selected_controller?.alpha != undefined) {
            return true;
        } else if (typeArray.includes('global') && selected_controller?.global != undefined) {
            return true;
        } else if (typeArray.includes('nha_array') && Array.isArray(selected_controller?.nha_array)) {
            return true;
        } else if (typeArray.includes('align_option') && Array.isArray(selected_controller?.align_option)) {
            return true;
        } else if (typeArray.includes('language') && selected_controller?.language != undefined) {
            return true;
        } else if (typeArray.includes('property_value') && selected_controller?.property_value != undefined && selected_controller?.selector_type == 'basic') {
            return true;
        } else if (typeArray.includes('size_units') && Array.isArray(selected_controller?.size_units)) {
            return true;
        } else if (typeArray.includes('conditions') && selected_controller?.conditions != undefined && selected_controller?.condition_value != undefined) {
            return true;
        } else if (typeArray.includes('selector_type') && selected_controller?.selector_type != undefined) {
            return true;
        } else if (typeArray.includes('is_external') && selected_controller?.is_external != undefined) {
            return true;
        } else if (typeArray.includes('nofollow') && selected_controller?.nofollow != undefined) {
            return true;
        } else if (typeArray.includes('url_options') && selected_controller?.url_options != undefined) {
            return true;
        } else if (typeArray.includes('custom_attributes') && selected_controller?.custom_attributes != undefined) {
            return true;
        }

        return false;
    }

    const accordion_condition = (typeArray) => {

        let condition = false;
        let propertyType = ''

        if (Array.isArray(typeArray) && typeArray.length > 0) {
            typeArray.forEach((type) => {

                if (Array.isArray(type)) {
                    propertyType = type;
                } else {
                    propertyType = [type];
                }

                if (field_condition(propertyType) && !condition) {
                    condition = true;
                }
            });
        }

        return condition;
    }

    const getDefaultInputType = () => {

        let inputType = 'text';

        const select_content = () => {
            return (
                <div className='cwk-dp-container'>
                    {selected_controller?.options?.map((option, index) => (
                        <span className='cwk-dp-item' key={index} onClick={() => { updateValue('defaultValue', option.value) }}>{option.value}</span>
                    ))}
                </div>
            )
        }

        if ('number' == selected_controller?.type) {
            inputType = 'number';
        } else if ('color' == selected_controller?.type) {
            inputType = 'color';
        } else if ('switcher' == selected_controller?.type) {
            return (
                <Switcher checked={selected_controller?.defaultValue ?? false} onChange={(e) => { updateValue('defaultValue', e.target.checked) }} />
            )
        } else if ('select' == selected_controller?.type) {
            return (
                <Dropdown
                    title={selected_controller?.defaultValue ?? ''}
                    content={select_content()}
                    overflow={true}
                />
            )
        } else if ('choose' == selected_controller?.type) {
            return (
                <div className='cwk-align-icons-wrapper'>
                    {selected_controller?.align_option?.map((option, index) => {
                        return (
                            <Tooltip key={index} content={<span className='cwk-align-icon'><img src={`${assets_path}/svg/align/${option.align_icon}.svg`} /></span>} tooltipText={option.align_label} />
                        )
                    })}
                </div>
            )
        } else if ('code' == selected_controller?.type) {
            return (
                <div className='cwk-fields-input-container'>
                    <CodeEditor lang={selected_controller?.language ?? 'html'} value={selected_controller?.defaultValue ?? ''} changeEvent={(value) => { updateValue('defaultValue', value) }} />
                </div>
            )
        } else if ('slider' == selected_controller?.type) {
            return (
                <div className='cwk-fields-input-container cwk-fields-input-container-slider'>
                    <input className='cwk-fields-input' type="number"
                        placeholder={__('Min', 'captain-widgets-kit')}
                        min={getValue('min')}
                        max={getValue('max')}
                        step={getValue('step')}
                        value={selected_controller?.defaultValue?.value ?? ''}
                        onChange={(e) => { updateController('defaultValue', 'value', e.target.value) }}
                    />
                    <Dropdown
                        title={selected_controller?.defaultValue?.unit ?? ''}
                        content={size_units_content()}
                    />
                </div>
            )
        }

        return (
            <input className='cwk-fields-input' type={inputType} placeholder={__('Default Value', 'captain-widgets-kit')} value={selected_controller?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
        )
    }

    const separator_content = () => {
        return (
            <div className='cwk-dp-container'>
                <span className='cwk-dp-item' onClick={() => { updateValue('separator', 'default') }}>{__('Default', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateValue('separator', 'before') }}>{__('Before', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateValue('separator', 'after') }}>{__('After', 'captain-widgets-kit')}</span>
            </div>
        )
    };

    const selector_type_content = () => {
        return (
            <div className='cwk-dp-container'>
                <span className='cwk-dp-item' onClick={() => { updateValue('selector_type', 'basic') }}>{__('Basic', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateValue('selector_type', 'advanced') }}>{__('Advanced', 'captain-widgets-kit')}</span>
            </div>
        )
    };

    const size_units_content = () => {
        return (
            <div className='cwk-dp-container'>
                {selected_controller?.size_units?.map((unitData, index) => {
                    if (unitData.checked) {
                        return (
                            <span className='cwk-dp-item' key={index} onClick={() => { updateController('defaultValue', 'unit', unitData.type) }}>{unitData.type}</span>
                        )
                    }
                })}
            </div>
        )
    };

    const condition_relation_content = () => {
        return (
            <div className='cwk-dp-container'>
                <span className='cwk-dp-item' onClick={() => { updateController('condition_value', 'relation', 'and') }}>{__('And', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('condition_value', 'relation', 'or') }}>{__('Or', 'captain-widgets-kit')}</span>
            </div>
        )
    };

    const condition_operator_content = (index) => {
        return (
            <div className='cwk-dp-container'>
                <span className='cwk-dp-item' onClick={() => { updateConditionValue(selected_controller?.condition_value?.values, index, 'operator', '==') }}>==</span>
                <span className='cwk-dp-item' onClick={() => { updateConditionValue(selected_controller?.condition_value?.values, index, 'operator', '!=') }}>!=</span>
            </div>
        )
    };

    const language_content = () => {
        return (
            <div className='cwk-dp-container'>
                <span className='cwk-dp-item' onClick={() => { updateValue('language', 'html') }}>{__('HTML', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateValue('language', 'css') }}>{__('CSS', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateValue('language', 'javascript') }}>{__('JavaScript', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateValue('language', 'php') }}>{__('PHP', 'captain-widgets-kit')}</span>
            </div>
        )
    };

    const input_type_content = () => {

        const input_type_array = [
            { value: 'text', label: __('Text', 'captain-widgets-kit') },
            { value: 'number', label: __('Number', 'captain-widgets-kit') },
            { value: 'color', label: __('Color', 'captain-widgets-kit') },
            { value: 'switcher', label: __('Switcher', 'captain-widgets-kit') },
            { value: 'date', label: __('Date', 'captain-widgets-kit') },
            { value: 'datetime-local', label: __('Datetime-Local', 'captain-widgets-kit') },
            { value: 'month', label: __('Month', 'captain-widgets-kit') },
            { value: 'time', label: __('Time', 'captain-widgets-kit') },
            { value: 'week', label: __('Week', 'captain-widgets-kit') },
        ];

        return (
            <div className='cwk-dp-container'>
                {input_type_array.map((item, index) => (
                    <span className='cwk-dp-item' key={index} onClick={() => { updateValue('input_type', item.value) }}>{item.label}</span>
                ))}
            </div>
        )
    };

    const addOption = () => {
        const newOption = {
            label: `Label ${selected_controller?.options?.length}`,
            value: `Value ${selected_controller?.options?.length}`
        }
        updateValue('options', [...selected_controller?.options, newOption]);
    }

    const deleteOption = (index) => {
        const newOptions = [...selected_controller?.options];
        newOptions.splice(index, 1);
        updateValue('options', newOptions);
    }

    const addConditionValue = () => {

        const newConditionValue = {
            name: '',
            operator: '==',
            value: ''
        }

        updateController('condition_value', 'values', [...selected_controller?.condition_value?.values, newConditionValue]);
    }

    const deleteConditionValue = (valuesArray, index) => {
        const newValuesArray = [...valuesArray];
        newValuesArray.splice(index, 1);
        updateController('condition_value', 'values', newValuesArray);
    }

    const addAlignOption = () => {

        const newOption = {
            align_label: `Label ${selected_controller?.align_option?.length}`,
            align_value: `Value ${selected_controller?.align_option?.length}`,
            align_icon: 'ecwk-i-text-align-left',
            align_title: '',
            align_svg: ''
        }

        updateValue('align_option', [...selected_controller?.align_option, newOption]);
    }

    const deleteAlignOption = (index) => {
        const newAlignOptions = [...selected_controller?.align_option];
        newAlignOptions.splice(index, 1);
        updateValue('align_option', newAlignOptions);
    }

    const updateNhaArray = (value, Label, checked) => {
        let newNhaArray = [...selected_controller?.nha_array];

        if (checked) {
            let update_nha = { value: value, label: Label };
            if (value == 'normal') {
                newNhaArray.splice(0, 0, update_nha);
            } else if (value == 'hover') {
                newNhaArray.splice(1, 0, update_nha);
            } else {
                newNhaArray.splice(newNhaArray?.length, 0, update_nha);
            }
        } else {
            if (newNhaArray.length > 1) {
                newNhaArray = newNhaArray.filter((item) => item.value !== value);
            }
        }
        updateValue('nha_array', newNhaArray);
    }

    const align_option_content = (index) => {
        return (
            <div className='cwk-dp-container'>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-text-align-left', index) }}>{__('Align Left', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-text-align-right', index) }}>{__('Align Right', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-text-align-center', index) }}>{__('Align Center', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-text-align-justify', index) }}>{__('Align Justify', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-arrow-up', index) }}>{__('Up Arrow', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-arrow-down', index) }}>{__('Down Arrow', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-arrow-right', index) }}>{__('Right Arrow', 'captain-widgets-kit')}</span>
                <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', 'ecwk-i-arrow-left', index) }}>{__('Left Arrow', 'captain-widgets-kit')}</span>
                {/* <span className='cwk-dp-item' onClick={() => { updateController('align_option', 'align_icon', '', index) }}>Custom Icon</span> */}
            </div>
        )
    }

    const accordion_header = (label) => {
        return (
            <div className='cwk-fields-accordion-header'>
                <span className='cwk-fields-accordion-header-label'>{label}</span>
            </div>
        )
    }

    const advanced_selectors_content = () => {
        return (
            <div className='cwk-fields-input-container cwk-fields-selectors-advanced'>
                <div className='cwk-fields-selectors-advanced-php'>{`'selectors' => array(`}</div>
                <CodeEditor lang={'php'} value={selected_controller?.selectors_advanced ?? ''} changeEvent={(value) => { updateValue('selectors_advanced', value) }} />
                <div className='cwk-fields-selectors-advanced-php'>{`)`}</div>
            </div>
        )
    }

    const handlePopup = (popup_type) => {
        let popup_data = '';

        if ('selectors_advanced' == popup_type) {
            popup_data = {
                title: 'Advanced Selectors',
                desc: '',
                body: advanced_selectors_content(),
            }
        }

        setShowPopup(popup_data);
    }

    const copyVariableName = (variable_name) => {
        copyToClipboard(variable_name);
        const toast_message = {
            title: __('Variable Name Copied', 'captain-widgets-kit'),
            desc: __('Variable name has been copied to your clipboard.', 'captain-widgets-kit'),
        }

        dispatch(handleToastMessage(toast_message));
    }

    return (
        <div className='cwk-controller-fields-wrapper'>
            {accordion_condition(['name', 'defaultValue']) &&
                <Accordion
                    header={accordion_header(__('Name & Value', 'captain-widgets-kit'))}
                    content={(
                        <>
                            {
                                field_condition(['name']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Variable Name', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('This is the controller’s unique ID, which will be used as a variable on the PHP side. You can access this controller using this variable name.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="text" placeholder={__('Name Value', 'captain-widgets-kit')} value={selected_controller?.name ?? ''} readOnly />
                                        <span className='cwk-controller-copy-icon' onClick={() => { copyVariableName(selected_controller?.name) }}>
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.99219 0.938477C8.81309 0.942433 9.49779 0.958941 10.0684 1.02637C10.8415 1.11776 11.4781 1.30984 12.0098 1.74609L12.1426 1.86035C12.2721 1.97777 12.3929 2.10496 12.5039 2.24023L12.6484 2.43359C12.964 2.89547 13.1231 3.43183 13.208 4.06152C13.2867 4.64553 13.3047 5.34883 13.3096 6.19531C13.7767 6.20499 14.187 6.22642 14.5439 6.27441C15.219 6.36518 15.7869 6.5603 16.2383 7.01172C16.6897 7.46314 16.8848 8.031 16.9756 8.70606C17.0642 9.36495 17.0625 10.2052 17.0625 11.25V12L17.0615 12.7451C17.0577 13.4533 17.042 14.0497 16.9756 14.5439C16.8848 15.219 16.6897 15.7869 16.2383 16.2383C15.7869 16.6897 15.219 16.8848 14.5439 16.9756C14.0497 17.042 13.4533 17.0577 12.7451 17.0615L12 17.0625H11.25C10.2052 17.0625 9.36495 17.0642 8.70606 16.9756C8.031 16.8848 7.46314 16.6897 7.01172 16.2383C6.5603 15.7869 6.36518 15.219 6.27441 14.5439C6.22642 14.187 6.20499 13.7767 6.19531 13.3096H5.96484C5.22015 13.3025 4.59178 13.2795 4.06152 13.208C3.43183 13.1231 2.89547 12.964 2.43359 12.6484L2.24023 12.5039C2.10496 12.3929 1.97777 12.2721 1.86035 12.1426L1.74609 12.0098C1.30984 11.4781 1.11776 10.8415 1.02637 10.0684C0.936463 9.30758 0.9375 8.34391 0.937501 7.125C0.937501 5.90609 0.936463 4.94242 1.02637 4.18164C1.11776 3.4085 1.30984 2.77191 1.74609 2.24023L1.86035 2.10742C1.97777 1.97788 2.10496 1.85711 2.24023 1.74609L2.44434 1.59375C2.93295 1.26343 3.50505 1.10634 4.18164 1.02637C4.94242 0.936463 5.90609 0.9375 7.125 0.937501L7.99219 0.938477ZM11.25 7.3125C10.1737 7.3125 9.42291 7.31353 8.85645 7.38965C8.30612 7.46364 8.01421 7.59907 7.80664 7.80664C7.59907 8.01421 7.46364 8.30612 7.38965 8.85645C7.31353 9.42291 7.3125 10.1737 7.3125 11.25V12L7.31348 12.749C7.31739 13.4405 7.33258 13.9688 7.38965 14.3936C7.46364 14.9439 7.59907 15.2358 7.80664 15.4434C8.01421 15.6509 8.30612 15.7864 8.85645 15.8604C9.42291 15.9365 10.1737 15.9375 11.25 15.9375H12L12.749 15.9365C13.4405 15.9326 13.9688 15.9174 14.3936 15.8604C14.9439 15.7864 15.2358 15.6509 15.4434 15.4434C15.6509 15.2358 15.7864 14.9439 15.8604 14.3936C15.9174 13.9688 15.9326 13.4405 15.9365 12.749L15.9375 12V11.25L15.9365 10.501C15.9326 9.80951 15.9174 9.28117 15.8604 8.85645C15.7864 8.30612 15.6509 8.01421 15.4434 7.80664C15.2358 7.59907 14.9439 7.46364 14.3936 7.38965C13.9688 7.33258 13.4405 7.31739 12.749 7.31348L12 7.3125H11.25ZM7.125 2.0625C5.87842 2.0625 4.99291 2.06324 4.31348 2.14356C3.7299 2.21254 3.35465 2.33497 3.07031 2.52832L2.9541 2.61621C2.89239 2.66686 2.83275 2.71999 2.77637 2.77637L2.61621 2.9541C2.37163 3.25215 2.22239 3.6465 2.14356 4.31348C2.06324 4.99291 2.0625 5.87842 2.0625 7.125C2.0625 8.37158 2.06324 9.25709 2.14356 9.93652C2.22239 10.6035 2.37163 10.9979 2.61621 11.2959L2.77637 11.4736C2.83275 11.53 2.89239 11.5831 2.9541 11.6338L3.06445 11.7168C3.33285 11.9012 3.68187 12.0223 4.21191 12.0938C4.67563 12.1562 5.24254 12.1766 5.96875 12.1836L6.1875 12.1846V11.25C6.1875 10.2052 6.18583 9.36495 6.27441 8.70606C6.36518 8.031 6.5603 7.46314 7.01172 7.01172C7.46314 6.5603 8.031 6.36518 8.70606 6.27441C9.36495 6.18583 10.2052 6.1875 11.25 6.1875H12.1846C12.1797 5.35493 12.1624 4.7212 12.0938 4.21191C12.0223 3.68187 11.9012 3.33285 11.7168 3.06445L11.6338 2.9541C11.5831 2.89239 11.53 2.83275 11.4736 2.77637L11.2959 2.61621C10.9979 2.37163 10.6035 2.22239 9.93652 2.14356C9.42705 2.08333 8.80169 2.0675 7.99512 2.06348L7.125 2.0625Z" fill="#020202"></path>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['defaultValue']) &&
                                <div className={`cwk-fields-content ${selected_controller?.type == 'code' ? 'cwk-fields-content-column' : ''}`}>
                                    <span className='cwk-fields-label-container'>
                                        {__('Default Value', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('This value is already set by default for the field.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        {getDefaultInputType()}
                                    </div>
                                </div>
                            }
                        </>
                    )}
                />
            }
            {
                accordion_condition(['showlabel', 'label', 'labelBlock']) &&
                <Accordion
                    header={accordion_header(__('Label', 'captain-widgets-kit'))}
                    content={(
                        <>
                            {
                                field_condition(['showlabel']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Show Label', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('This option lets you decide if the label is displayed.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.showlabel ?? false} onChange={(e) => { updateValue('showlabel', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['label']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Label', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('This label is shown above the field.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="text" placeholder={__('Label Value', 'captain-widgets-kit')} value={selected_controller?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['labelBlock']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Label Block', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Choose whether the label should be displayed on a separate line or not.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.labelBlock ?? false} onChange={(e) => { updateValue('labelBlock', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                        </>
                    )}
                />
            }
            {
                accordion_condition(['language', 'number_setting', ['label_off', 'label_on'], 'size_units', 'options', 'return_value', 'align_option', 'description', 'placeHolder', 'rows', 'nha_array', 'types', 'separator', 'input_type', 'controlClass', 'is_external', 'nofollow', 'url_options', 'custom_attributes']) &&
                <Accordion
                    header={accordion_header(__('Meta Options', 'captain-widgets-kit'))}
                    content={(
                        <>
                            {
                                field_condition(['language']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Language', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Select the language for the type of code you want to write.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container cwk-fields-label-container-dropdown'>
                                        <Dropdown
                                            title={selected_controller?.language ?? ''}
                                            content={language_content()}
                                        />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['number_setting']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Number Setting', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Set the minimum value, maximum value, and step size for the number controller.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-unit-wrapper'>
                                        <div className='cwk-fields-unit-contaner'>
                                            <input className='cwk-fields-input' type="number" placeholder={__('Min', 'captain-widgets-kit')} value={selected_controller?.number_setting?.min ?? ''} onChange={(e) => { updateController('number_setting', 'min', e.target.value) }} />
                                            <span className='cwk-fields-unit-item'>{__('Min', 'captain-widgets-kit')}</span>
                                        </div>
                                        <div className='cwk-fields-unit-contaner'>
                                            <input className='cwk-fields-input' type="number" placeholder={__('Max', 'captain-widgets-kit')} value={selected_controller?.number_setting?.max ?? ''} onChange={(e) => { updateController('number_setting', 'max', e.target.value) }} />
                                            <span className='cwk-fields-unit-item'>{__('Max', 'captain-widgets-kit')}</span>
                                        </div>
                                        <div className='cwk-fields-unit-contaner'>
                                            <input className='cwk-fields-input' type="number" placeholder={__('Step', 'captain-widgets-kit')} value={selected_controller?.number_setting?.step ?? ''} onChange={(e) => { updateController('number_setting', 'step', e.target.value) }} />
                                            <span className='cwk-fields-unit-item'>{__('Step', 'captain-widgets-kit')}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['label_off', 'label_on']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Switcher Label', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The labels used for the “unchecked” and “checked” states.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-unit-wrapper'>
                                        <div className='cwk-fields-unit-contaner'>
                                            <input className='cwk-fields-input' type="text" placeholder={__('Switch Is Off', 'captain-widgets-kit')} value={selected_controller?.label_on ?? ''} onChange={(e) => { updateValue('label_on', e.target.value) }} />
                                            <span className='cwk-fields-unit-item'>{__('On', 'captain-widgets-kit')}</span>
                                        </div>
                                        <div className='cwk-fields-unit-contaner'>
                                            <input className='cwk-fields-input' type="text" placeholder={__('Switch Is On', 'captain-widgets-kit')} value={selected_controller?.label_off ?? ''} onChange={(e) => { updateValue('label_off', e.target.value) }} />
                                            <span className='cwk-fields-unit-item'>{__('Off', 'captain-widgets-kit')}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['custom_attributes']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Custom Attributes', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('A custom attributes string provided as comma-separated key|value pairs.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="text" placeholder={__('Custom Attributes', 'captain-widgets-kit')} value={selected_controller?.custom_attributes ?? ''} onChange={(e) => { updateValue('custom_attributes', e.target.value) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['is_external']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Is External', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Choose whether to open the URL in the same tab or a new tab.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.is_external ?? false} onChange={(e) => { updateValue('is_external', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['nofollow']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('No Follow', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Choose whether to add the nofollow attribute.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.nofollow ?? false} onChange={(e) => { updateValue('nofollow', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['url_options']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('URL Options', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Enable this option for the url_options value.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.url_options ?? false} onChange={(e) => { updateValue('url_options', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['size_units']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Size Units & Range', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('An array specifying the ranges for each register size.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-options-container'>
                                        <div className='cwk-fields-options-header'>
                                            <span className='cwk-fields-options-header-item'>{__('Unit', 'captain-widgets-kit')}</span>
                                            <span className='cwk-fields-options-header-item'>{__('Min', 'captain-widgets-kit')}</span>
                                            <span className='cwk-fields-options-header-item'>{__('Max', 'captain-widgets-kit')}</span>
                                            <span className='cwk-fields-options-header-item'>{__('Step', 'captain-widgets-kit')}</span>
                                        </div>
                                        {selected_controller?.size_units?.map((unitData, index) => {
                                            return (
                                                <div className='cwk-fields-options-item'>
                                                    <label className='cwk-size-unit-label' htmlFor={`cwk-size-unit-${unitData?.type}`}>
                                                        <Checkbox id={`cwk-size-unit-${unitData?.type}`} checked={unitData.checked} onChange={(e) => { updateController('size_units', 'checked', e.target.checked, index) }} />
                                                        <span>{unitData?.type}</span>
                                                    </label>
                                                    <input className='cwk-fields-input' type="number" placeholder={__('Min', 'captain-widgets-kit')} value={unitData.min} onChange={(e) => { updateController('size_units', 'min', e.target.value, index) }} />
                                                    <input className='cwk-fields-input' type="number" placeholder={__('Max', 'captain-widgets-kit')} value={unitData.max} onChange={(e) => { updateController('size_units', 'max', e.target.value, index) }} />
                                                    <input className='cwk-fields-input' type="number" placeholder={__('Step', 'captain-widgets-kit')} value={unitData.step} onChange={(e) => { updateController('size_units', 'step', e.target.value, index) }} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['options']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Drop down Values', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The values for the drop down list.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-options-container'>
                                        <div className='cwk-fields-options-header'>
                                            <span className='cwk-fields-options-header-item'>{__('Label', 'captain-widgets-kit')}</span>
                                            <span className='cwk-fields-options-header-item'>{__('Value', 'captain-widgets-kit')}</span>
                                        </div>
                                        {selected_controller?.options?.map((option, index) => {
                                            return (
                                                <div className='cwk-fields-options-item'>
                                                    <input className='cwk-fields-input' type="text" placeholder='Label' value={option.label} onChange={(e) => { updateController('options', 'label', e.target.value, index) }} />
                                                    <input className='cwk-fields-input' type="text" placeholder='Label' value={option.value} onChange={(e) => { updateController('options', 'value', e.target.value, index) }} />
                                                    <span className={`cwk-fields-options-item-delete ${selected_controller?.options?.length == 1 ? 'cwk-fields-options-item-delete-disabled' : ''}`}
                                                        onClick={() => { deleteOption(index) }}>
                                                        <i className='cwk-i-delete'></i>
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <span className='cwk-fields-options-add' onClick={() => { addOption() }}>{__('Add Option', 'captain-widgets-kit')}</span>
                                </div>
                            }
                            {
                                field_condition(['return_value']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Return Value', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The value that is returned when checked.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="text" placeholder={__('Return Value', 'captain-widgets-kit')} value={selected_controller?.return_value ?? ''} onChange={(e) => { updateValue('return_value', e.target.value) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['align_option']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Align Option', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The values for the drop down list.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-options-container'>
                                        <div className='cwk-fields-options-header'>
                                            <span className='cwk-fields-options-header-item'>{__('Label', 'captain-widgets-kit')}</span>
                                            <span className='cwk-fields-options-header-item'>{__('Value', 'captain-widgets-kit')}</span>
                                            <span className='cwk-fields-options-header-item'>{__('Icon', 'captain-widgets-kit')}</span>
                                        </div>
                                        {selected_controller?.align_option?.map((option, index) => {
                                            return (
                                                <div className='cwk-fields-options-item'>
                                                    <input className='cwk-fields-input' type="text" placeholder={__('Label', 'captain-widgets-kit')} value={option.align_label} onChange={(e) => { updateController('align_option', 'align_label', e.target.value, index) }} />
                                                    <input className='cwk-fields-input' type="text" placeholder={__('Label', 'captain-widgets-kit')} value={option.align_value} onChange={(e) => { updateController('align_option', 'align_value', e.target.value, index) }} />
                                                    <Dropdown
                                                        title={(<input className='cwk-options-header-item' value={option.align_icon} readOnly />)}
                                                        content={align_option_content(index)}
                                                    />
                                                    <span className={`cwk-fields-options-item-delete ${selected_controller?.align_option?.length == 1 ? 'cwk-fields-options-item-delete-disabled' : ''}`}
                                                        onClick={() => { deleteAlignOption(index) }}>
                                                        <i className='cwk-i-delete'></i>
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <span className='cwk-fields-options-add' onClick={() => { addAlignOption() }}>{__('Add Align Option', 'captain-widgets-kit')}</span>
                                </div>
                            }
                            {
                                field_condition(['description']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Description', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The description that appears below the field.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <textarea className='cwk-fields-input' placeholder='Description' value={selected_controller?.description ?? ''} onChange={(e) => { updateValue('description', e.target.value) }} rows='3'></textarea>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['placeHolder']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Placeholder', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The placeholder text that appears in the field.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="text" placeholder={__('Placeholder Value', 'captain-widgets-kit')} value={selected_controller?.placeHolder ?? ''} onChange={(e) => { updateValue('placeHolder', e.target.value) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['rows']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Rows', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The number of rows for the textarea field.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="number" placeholder={__('Number of Rows', 'captain-widgets-kit')} value={selected_controller?.rows ?? ''} min={1} onChange={(e) => { updateValue('rows', e.target.value) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['nha_array']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Normal Hover Types', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The normal, hover, and active states for the field.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-unit-wrapper'>
                                        <label className='cwk-normalHover-label' htmlFor='cwk-normalHover-normal'>
                                            <Checkbox id='cwk-normalHover-normal' checked={selected_controller?.nha_array?.find(item => item.value == 'normal') ? true : false} onChange={(e) => { updateNhaArray('normal', 'Normal', e.target.checked) }} />
                                            {__('Normal', 'captain-widgets-kit')}
                                        </label>
                                        <label className='cwk-normalHover-label' htmlFor='cwk-normalHover-hover'>
                                            <Checkbox id='cwk-normalHover-hover' checked={selected_controller?.nha_array?.find(item => item.value == 'hover') ? true : false} onChange={(e) => { updateNhaArray('hover', 'Hover', e.target.checked) }} />
                                            {__('Hover', 'captain-widgets-kit')}
                                        </label>
                                        <label className='cwk-normalHover-label' htmlFor='cwk-normalHover-active'>
                                            <Checkbox id='cwk-normalHover-active' checked={selected_controller?.nha_array?.find(item => item.value == 'active') ? true : false} onChange={(e) => { updateNhaArray('active', 'Active', e.target.checked) }} />
                                            {__('Active', 'captain-widgets-kit')}
                                        </label>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['types']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Background Types', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The background types for the field.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-unit-wrapper'>
                                        <label className='cwk-fields-type-wrapper' htmlFor='cwk-bg-classic'>
                                            <Checkbox checked={selected_controller?.types?.includes('classic') ?? false} onChange={(e) => { updateArray('types', 'classic', e.target.checked) }} id='cwk-bg-classic' />
                                            {__('Classic', 'captain-widgets-kit')}
                                        </label>
                                        <label className='cwk-fields-type-wrapper' htmlFor='cwk-bg-gradient'>
                                            <Checkbox checked={selected_controller?.types?.includes('gradient') ?? false} onChange={(e) => { updateArray('types', 'gradient', e.target.checked) }} id='cwk-bg-gradient' />
                                            {__('Gradient', 'captain-widgets-kit')}
                                        </label>
                                    </div>

                                </div>
                            }
                            {
                                field_condition(['separator']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Separator', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Use the separator to add an extra design line above or below the controller.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container cwk-fields-label-container-dropdown'>
                                        <Dropdown
                                            title={selected_controller?.separator ?? ''}
                                            content={separator_content()}
                                        />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['input_type']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Input Type', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The type of input field to be displayed.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container cwk-fields-label-container-dropdown'>
                                        <Dropdown
                                            title={selected_controller?.input_type ?? ''}
                                            content={input_type_content()}
                                        />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['controlClass']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Control Class', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The class name you add here will be applied to the controller DOM on the Elementor side.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="text" placeholder={__('Classes', 'captain-widgets-kit')} value={selected_controller?.controlClass ?? ''} onChange={(e) => { updateValue('controlClass', e.target.value) }} />
                                    </div>
                                </div>
                            }
                        </>
                    )}
                />
            }
            {
                accordion_condition([['selectors', 'basic'], ['selectors', 'advanced'], 'selector', 'selector_value', ['selector_value', 'textarea'], 'property_value', 'selector_type']) &&
                <Accordion
                    header={accordion_header(__('Selectors', 'captain-widgets-kit'))}
                    content={(
                        <>
                            {
                                field_condition(['selector_type']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Selector Type', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The type of selector to be used.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container cwk-fields-label-container-dropdown'>
                                        <Dropdown
                                            title={selected_controller?.selector_type ?? ''}
                                            content={selector_type_content()}
                                        />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['selectors', 'basic']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('CSS Selectors', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Add your custom class name here. The controller’s CSS will automatically apply to the class you add.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <textarea className='cwk-fields-input' placeholder={__('CSS Selectors', 'captain-widgets-kit')} value={selected_controller?.selectors ?? ''} onChange={(e) => { updateValue('selectors', e.target.value) }} rows='3'></textarea>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['selectors', 'advanced']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('CSS Selectors', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Add your custom class name here. The controller’s CSS will automatically apply to the class you add.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <span className='cwk-fields-options-add' onClick={() => { handlePopup('selectors_advanced') }}>{__('Add Selectors', 'captain-widgets-kit')}</span>
                                </div>
                            }
                            {
                                field_condition(['selector']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('CSS Selector', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Add your custom class name here. The controller’s CSS will automatically apply to the class you add.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <textarea className='cwk-fields-input' placeholder={__('CSS Selector', 'captain-widgets-kit')} value={selected_controller?.selector ?? ''} onChange={(e) => { updateValue('selector', e.target.value) }} rows='3'></textarea>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['selector_value']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('CSS Property', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('In the CSS property field, add properties like margin, padding, or border that you want to apply CSS to.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <input className='cwk-fields-input' type="text" placeholder={__('CSS Property', 'captain-widgets-kit')} value={selected_controller?.selector_value ?? ''} onChange={(e) => { updateValue('selector_value', e.target.value) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['selector_value', 'textarea']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('CSS Property', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('In the CSS property field, add properties like margin, padding, or border that you want to apply CSS to.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <textarea className='cwk-fields-input' placeholder={__('CSS Property', 'captain-widgets-kit')} value={selected_controller?.selector_value ?? ''} onChange={(e) => { updateValue('selector_value', e.target.value) }} rows='3'></textarea>
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['property_value']) &&
                                <div className='cwk-fields-content cwk-fields-content-column'>
                                    <span className='cwk-fields-label-container'>
                                        {__('CSS Property Value', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Enter CSS properties (e.g., color, font-size, background-color) to apply to the chosen class or ID.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <textarea className='cwk-fields-input' placeholder={__('CSS Property value', 'captain-widgets-kit')} value={selected_controller?.property_value ?? ''} onChange={(e) => { updateValue('property_value', e.target.value) }} rows='3'></textarea>
                                    </div>
                                </div>
                            }
                        </>
                    )}
                />
            }
            {
                accordion_condition(['alpha', 'global', 'ai_support', 'dynamic', 'responsive']) &&
                <Accordion
                    header={accordion_header(__('Global', 'captain-widgets-kit'))}
                    content={(
                        <>
                            {
                                field_condition(['alpha']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Alpha', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Choose whether to allow the alpha channel.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.alpha ?? false} onChange={(e) => { updateValue('alpha', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['global']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Global Color', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('The default color in RGB, RGBA, or HEX format.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.global ?? false} onChange={(e) => { updateValue('global', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['ai_support']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('AI Support', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Choose whether to enable AI support.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.ai_support ?? false} onChange={(e) => { updateValue('ai_support', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['dynamic']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Dynamic', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Enable this option for a dynamic value.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.dynamic ?? false} onChange={(e) => { updateValue('dynamic', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                            {
                                field_condition(['responsive']) &&
                                <div className='cwk-fields-content'>
                                    <span className='cwk-fields-label-container'>
                                        {__('Responsive', 'captain-widgets-kit')}
                                        <Tooltip
                                            content={TooltipSvg}
                                            tooltipText={(__('Switch between Mobile, Laptop, and Tablet modes.', 'captain-widgets-kit'))}
                                            right={true}
                                        />
                                    </span>
                                    <div className='cwk-fields-input-container'>
                                        <Switcher checked={selected_controller?.responsive ?? false} onChange={(e) => { updateValue('responsive', e.target.checked) }} />
                                    </div>
                                </div>
                            }
                        </>
                    )}
                />
            }
            {
                accordion_condition(['conditions']) &&
                <Accordion
                    header={accordion_header(__('Conditions', 'captain-widgets-kit'))}
                    content={(
                        <>
                            {
                                field_condition(['conditions']) &&
                                <div className='cwk-multiple-content'>
                                    <div className='cwk-fields-content'>
                                        <span className='cwk-fields-label-container'>
                                            {__('Conditions', 'captain-widgets-kit')}
                                            <Tooltip
                                                content={TooltipSvg}
                                                tooltipText={(__('Choose whether to apply conditions to the controller.', 'captain-widgets-kit'))}
                                                right={true}
                                            />
                                        </span>
                                        <div className='cwk-fields-input-container'>
                                            <Switcher checked={selected_controller?.conditions ?? false} onChange={(e) => { updateValue('conditions', e.target.checked) }} />
                                        </div>
                                    </div>
                                    {selected_controller?.conditions &&
                                        <>
                                            <div className='cwk-fields-content'>
                                                <span className='cwk-fields-label-container'>
                                                    {__('Condition Value', 'captain-widgets-kit')}
                                                    <Tooltip
                                                        content={TooltipSvg}
                                                        tooltipText={(__('The relation between the conditions.', 'captain-widgets-kit'))}
                                                        right={true}
                                                    />
                                                </span>
                                                <div className='cwk-fields-input-container cwk-fields-label-container-dropdown'>
                                                    <Dropdown
                                                        title={selected_controller?.condition_value?.relation ?? ''}
                                                        content={condition_relation_content()}
                                                    />
                                                </div>
                                            </div>
                                            <div className='cwk-fields-content cwk-fields-content-column'>
                                                <div className='cwk-fields-options-container'>
                                                    <div className='cwk-fields-options-header'>
                                                        <span className='cwk-fields-options-header-item'>{__('Name', 'captain-widgets-kit')}</span>
                                                        <span className='cwk-fields-options-header-item'>{__('Operator', 'captain-widgets-kit')}</span>
                                                        <span className='cwk-fields-options-header-item'>{__('Value', 'captain-widgets-kit')}</span>
                                                    </div>
                                                    {selected_controller?.condition_value?.values?.map((condition, index) => {
                                                        return (
                                                            <div className='cwk-fields-options-item'>
                                                                <input className='cwk-fields-input' type="text" placeholder='Label' value={condition.name} onChange={(e) => { updateConditionValue(selected_controller?.condition_value?.values, index, 'name', e.target.value) }} />
                                                                <Dropdown
                                                                    title={condition.operator ?? ''}
                                                                    content={condition_operator_content(index)}
                                                                />
                                                                <input className='cwk-fields-input' type="text" placeholder='Label' value={condition.value} onChange={(e) => { updateConditionValue(selected_controller?.condition_value?.values, index, 'value', e.target.value) }} />
                                                                <span className={`cwk-fields-options-item-delete ${selected_controller?.condition_value?.values?.length == 1 ? 'cwk-fields-options-item-delete-disabled' : ''}`}
                                                                    onClick={() => { deleteConditionValue(selected_controller?.condition_value?.values, index) }}
                                                                >
                                                                    <i className='cwk-i-delete'></i>
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <span className='cwk-fields-options-add' onClick={() => { addConditionValue() }}>{__('Add Condition Value', 'captain-widgets-kit')}</span>
                                            </div>
                                        </>
                                    }
                                </div>
                            }
                        </>
                    )}
                />
            }
            {showPopup &&
                <Popup_structure
                    title={showPopup?.title}
                    desc={showPopup?.desc}
                    body={showPopup?.body}
                    close_popup={() => { setShowPopup('') }} />
            }
        </div>
    )

}

export default Fields;
