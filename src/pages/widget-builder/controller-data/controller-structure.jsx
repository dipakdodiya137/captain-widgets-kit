import React, { Fragment } from 'react'
import './controller-structure.scss'
import { useDispatch, useSelector } from 'react-redux';
import { handleSectionData } from '../../../redux/slice.jsx';
import Switcher from '../../../components/switcher/switcher.jsx';
import Dropdown from '../../../global/dropdown/dropdown.jsx';
import { drag_controller_data } from '../controller-listing/controller-listing.jsx';
import { controller_array } from './controller-array.js';
import { getControllerVariable } from '../../../global/elements.js';
import Tooltip from '../../../components/tooltip/tooltip.jsx';
import CodeEditor from '../../../components/code-editor/code-editor.jsx';
import { __ } from '@wordpress/i18n';

const ControllerStructure = (props) => {

    const controller_data = props?.controller;
    const section_data = useSelector((state) => state?.controller_section);
    const dispatch = useDispatch();
    const assets_path = captwiki_data?.captwiki_assets;
    const notAllwoedControllers = ['normalhover'];
    const hideEditControlls = ['preview'];

    const updateValue = (type, value) => {


        const empty_check = [];

        if ((empty_check.includes(type) && value.trim() == '') || props.index == undefined) {
            return;
        }

        const activeIndex = section_data.active_section ?? 0;

        let newLayout = [...section_data?.[section_data?.active_tab]];
        let activeSection = { ...newLayout[activeIndex] };
        var newControllers = [...activeSection.controllers];

        if (props.parent_index || props.parent_index === 0) {
            newControllers = newControllers.map((controller, cIndex) => {
                if (cIndex === props.parent_index) {

                    const updatedFields = controller.fields.map((field, fieldIndex) => {
                        if (fieldIndex === props.index) {
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
                if (cIndex === props.index) {
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

    const updateController = (controllerValue, valueType, value) => {
        if (controller_data?.[controllerValue]) {
            var newValue = { ...controller_data?.[controllerValue] };
            newValue = { ...newValue, [valueType]: value }
            updateValue(controllerValue, newValue);
        }
    }

    const getValue = (valueType) => {
        if (controller_data?.type == 'dimension') {
            if (controller_data?.dimension_defaultValue?.isLinked) {
                return controller_data?.dimension_defaultValue?.top;
            } else {
                return controller_data?.dimension_defaultValue?.[valueType];
            }
        } else if (controller_data?.type == 'slider') {
            let unitData = controller_data?.size_units?.find((unit) => unit.type == controller_data?.defaultValue?.unit)?.[valueType];
            return unitData;
        }
    }

    const handleActiveController = () => {

        if (controller_data?.type == 'preview') {
            return;
        }

        let new_section_data = { ...section_data }

        if (props.parent_index || props.parent_index === 0) {
            new_section_data.active_controller = props.parent_index;
            new_section_data.active_field = props.index;
            dispatch(handleSectionData(new_section_data));
        } else if (section_data?.active_controller !== props.index || (section_data?.active_field || section_data?.active_field == 0)) {
            new_section_data.active_controller = props.index;
            new_section_data.active_field = null;
            dispatch(handleSectionData(new_section_data));
        }
    }

    const deleteController = () => {

        let redux_section_data = { ...section_data }

        const activeIndex = section_data.active_section ?? 0;
        const newLayout = [...redux_section_data[redux_section_data.active_tab]];

        const activeSection = { ...newLayout[activeIndex] };

        var newControllers = [...activeSection.controllers];

        if (props.parent_index || props.parent_index === 0) {
            newControllers = newControllers.map((item, index) => {
                if (index === props.parent_index) {
                    return { ...item, fields: item.fields.filter((field, fieldIndex) => fieldIndex !== props.index) };
                }
                return item;
            });
        } else {
            newControllers = newControllers.filter((data, index) => props.index !== index);
        }

        activeSection.controllers = newControllers;

        newLayout[activeIndex] = activeSection;

        redux_section_data[redux_section_data.active_tab] = newLayout;

        redux_section_data.active_controller = null;

        if (redux_section_data?.active_field || redux_section_data?.active_field === 0) {
            redux_section_data.active_field = null;
        }

        redux_section_data.active_section = activeIndex;

        dispatch(handleSectionData(redux_section_data));
    }

    const AddFieldController = (controller, index) => {

        if (notAllwoedControllers.includes(controller?.name)) {
            return;
        }

        let redux_section_data = { ...section_data }

        const activeIndex = section_data.active_section ?? 0;

        const newLayout = [...redux_section_data?.[section_data?.active_tab]];

        var new_controller = { ...controller_array[controller.name], name: getControllerVariable(controller.name) };

        // this condition willl use to add key in normal hover controller
        if ('normalhover' == newLayout[activeIndex]?.controllers?.[props.index]?.type) {
            new_controller = { ...controller_array[controller.name], key: newLayout[activeIndex]?.controllers?.[props.index]?.nha_type, name: getControllerVariable(controller.name) }
        }

        let newFields = [...newLayout[activeIndex]?.controllers?.[props.index]?.fields]
        newFields.splice(index ?? newFields.length, 0, new_controller)

        var updateFields = { ...newLayout[activeIndex]?.controllers?.[props.index], fields: newFields };

        var updated_controller = [...newLayout[activeIndex]?.controllers]
        updated_controller.splice(props?.index, 1, updateFields)

        let new_section = { ...newLayout[activeIndex], controllers: updated_controller }

        newLayout[activeIndex] = new_section;
        redux_section_data[section_data?.active_tab] = newLayout;
        redux_section_data.active_section = activeIndex;

        dispatch(handleSectionData(redux_section_data));
    };

    const innerController = () => {


        const getStyle = (styleArray) => {

            if (!(Array.isArray(styleArray))) {
                return;
            }

            let styleContent = {};

            if (styleArray.includes('showlabel')) {
                if (controller_data?.showlabel) {
                    styleContent.opacity = 1;
                    styleContent.visibility = 'visible';
                } else {
                    styleContent.opacity = 0;
                    styleContent.visibility = 'hidden';
                }
            }
            if (styleArray.includes('labelBlock')) {
                if (controller_data?.labelBlock) {
                    styleContent.flexDirection = 'column';
                } else {
                    styleContent.flexDirection = 'row';
                }
            }
            return styleContent;
        }

        const handleAddControllerDrop = (e) => {

            const controller = drag_controller_data.get('captwiki-controller');

            if (controller) {
                AddFieldController(controller);
            }

            if (e.target.classList.contains('captwiki-add-controller')) {
                e.target.classList.remove('captwiki-add-controller-show');
            }
        }


        const handleDragEnter = (e) => {
            if (e.target.classList.contains('captwiki-controller-drop')) {
                e.target.classList.add('captwiki-controller-drop-show');
            }
        }

        const handleDragLeave = (e) => {
            if (e.target.classList.contains('captwiki-controller-drop')) {
                e.target.classList.remove('captwiki-controller-drop-show');
            }
        }

        const handleDrop = (e, index) => {

            const controller = drag_controller_data.get('captwiki-controller');

            if (controller) {
                AddFieldController(controller, index);
            }

            if (e.target.classList.contains('captwiki-controller-drop')) {
                e.target.classList.remove('captwiki-controller-drop-show');
            }
        }

        if ('text' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel',])} />
                    <input className='captwiki-controller-input' type="text" placeholder={controller_data?.placeHolder ?? ''} value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
                </div>
            )
        } else if ('number' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <input className='captwiki-controller-input' type="number" placeholder={controller_data?.placeHolder ?? ''} value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
                </div>
            )
        } else if ('textarea' == controller_data?.type) {
            return (
                <div className='captwiki-controller-large' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <textarea className='captwiki-controller-input' placeholder={controller_data?.placeHolder ?? ''} value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} rows={controller_data?.rows ?? 1} />
                </div>
            )
        } else if ('switcher' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <div className='captwiki-controller-input-container'>
                        <Switcher checked={controller_data?.defaultValue ?? false} onChange={(e) => { updateValue('defaultValue', e.target.checked) }} />
                    </div>
                </div>
            )
        } else if ('color' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <input className='captwiki-controller-input-color' type="color" value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
                </div>
            )
        } else if ('select' == controller_data?.type) {
            const select_content = () => {
                return (
                    <div className='captwiki-controller-select-content'>
                        {controller_data?.options?.map((option, index) => (
                            <span className='captwiki-controller-select-content-item' key={index} onClick={() => { updateValue('defaultValue', option.value) }}>{option.label}</span>
                        ))}
                    </div>
                )
            }
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <div className='captwiki-controller-dropdown'>
                        <Dropdown
                            title={controller_data?.defaultValue ?? ''}
                            content={select_content()}
                            overflow={true}
                        />
                    </div>
                </div>
            )
        } else if ('dimension' == controller_data?.type) {
            var isLinked = controller_data?.dimension_defaultValue?.isLinked;

            return (
                <div className='captwiki-controller-large'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                    <div className='crafpa-controller-unit-content'>
                        <div className='captwiki-controller-dropdown-item'>
                            <input className='captwiki-controller-dropdown' type="number" value={(getValue('top'))} onChange={(e) => { updateController('dimension_defaultValue', 'top', e.target.value) }} />
                            <span className='captwiki-controller-dropdown-item-label'>Top</span>
                        </div>
                        <div className='captwiki-controller-dropdown-item'>
                            <input className='captwiki-controller-dropdown' type="number" value={(getValue('right'))} onChange={(e) => { updateController('dimension_defaultValue', isLinked ? 'top' : 'right', e.target.value) }} />
                            <span className='captwiki-controller-dropdown-item-label'>Right</span>
                        </div>
                        <div className='captwiki-controller-dropdown-item'>
                            <input className='captwiki-controller-dropdown' type="number" value={(getValue('bottom'))} onChange={(e) => { updateController('dimension_defaultValue', isLinked ? 'top' : 'bottom', e.target.value) }} />
                            <span className='captwiki-controller-dropdown-item-label'>Bottom</span>
                        </div>
                        <div className='captwiki-controller-dropdown-item'>
                            <input className='captwiki-controller-dropdown' type="number" value={(getValue('left'))} onChange={(e) => { updateController('dimension_defaultValue', isLinked ? 'top' : 'left', e.target.value) }} />
                            <span className='captwiki-controller-dropdown-item-label'>Left</span>
                        </div>
                        <span className={`captwiki-controller-linked ${controller_data?.dimension_defaultValue?.isLinked ? 'captwiki-controller-linked-active' : ''}`} onClick={(e) => { e.stopPropagation(); updateController('dimension_defaultValue', 'isLinked', !isLinked) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36" fill="none">
                                <path d="M19.3455 23.4081L13.1661 29.6029C12.7674 30.0026 12.1694 30.4023 11.5714 30.6021C10.3754 31.1017 9.07973 31.1017 7.88372 30.6021C7.28571 30.4023 6.78738 30.0026 6.28904 29.6029C5.89037 29.2033 5.49169 28.6038 5.29236 28.0043C5.09302 27.5047 4.99336 26.8053 4.99336 26.2058C4.99336 25.6063 5.09302 25.0068 5.39203 24.4073C5.59136 23.8077 5.99003 23.3082 6.3887 22.8086L12.5681 16.6137C12.9668 16.2141 12.9668 15.6146 12.5681 15.2149C12.1694 14.8152 11.5714 14.8152 11.1728 15.2149L4.99336 21.4097C4.39535 22.0092 3.89701 22.8086 3.49834 23.6079C3.19934 24.4073 3 25.3065 3 26.2058C3 27.105 3.19934 28.0043 3.49834 28.8036C3.89701 29.6029 4.39535 30.4023 4.99336 31.0018C5.59136 31.6013 6.3887 32.1008 7.18605 32.5005C7.98339 32.9002 8.8804 33.0001 9.77741 33.0001C10.6744 33.0001 11.5714 32.8003 12.3688 32.5005C13.1661 32.2008 13.9635 31.7012 14.5615 31.0018L20.7409 24.8069C21.1395 24.4072 21.1395 23.8077 20.7409 23.4081C20.3422 23.0084 19.7442 23.0084 19.3455 23.4081Z" fill="black" />
                                <path d="M32.402 7.22148C32.0033 6.42215 31.505 5.62281 30.907 5.02331C30.309 4.42381 29.5116 3.92423 28.7143 3.52456C27.0199 2.82515 25.2259 2.82515 23.5316 3.52456C22.7342 3.92423 21.9369 4.42381 21.3389 5.02331L15.3588 11.0183C14.9601 11.418 14.9601 12.0175 15.3588 12.4172C15.7575 12.8168 16.3555 12.8168 16.7542 12.4172L22.7342 6.42215C23.1329 6.02248 23.7309 5.62281 24.3289 5.42298C25.5249 4.9234 26.8206 4.9234 28.0166 5.42298C28.6146 5.62281 29.113 6.02248 29.6113 6.42215C30.01 6.82182 30.4087 7.42132 30.608 8.02082C30.8073 8.62032 31.0067 9.21982 31.0067 9.81932C31.0067 10.4188 30.907 11.0183 30.608 11.6178C30.4087 12.2173 30.01 12.7169 29.6113 13.2165L23.6312 19.2115C23.2326 19.6112 23.2326 20.2107 23.6312 20.6103C23.8306 20.8102 24.1296 20.9101 24.3289 20.9101C24.5283 20.9101 24.8273 20.8102 25.0266 20.6103L31.0067 14.6153C31.6047 14.0158 32.103 13.2165 32.5017 12.4172C32.8007 11.6178 33 10.7186 33 9.81932C32.9003 8.92007 32.701 8.02082 32.402 7.22148Z" fill="black" />
                                <path d="M20.8405 13.7161L13.7641 20.8102C13.3654 21.2099 13.3654 21.8094 13.7641 22.2091C13.9634 22.4089 14.2624 22.5088 14.4618 22.5088C14.6611 22.5088 14.9601 22.4089 15.1594 22.2091L22.2359 15.115C22.6345 14.7153 22.6345 14.1158 22.2359 13.7161C21.8372 13.3165 21.1395 13.3165 20.8405 13.7161Z" fill="black" />
                            </svg>
                        </span>
                    </div>
                </div>
            )
        } else if ('typography' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                    <span className='captwiki-controller-value-icon'>
                        <i className='captwiki-i-typo-controller'></i>
                    </span>
                </div>
            )
        } else if ('textshadow' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                    <span className='captwiki-controller-value-icon'>
                        <i className='captwiki-i-textshadow-controller'></i>
                    </span>
                </div>
            )
        } else if ('boxshadow' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                    <span className='captwiki-controller-value-icon'>
                        <i className='captwiki-i-boxshadow-controller'></i>
                    </span>
                </div>
            )
        } else if ('border' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                    <span className='captwiki-controller-value-icon'>
                        <i className='captwiki-i-border-controller'></i>
                    </span>
                </div>
            )
        } else if ('background' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                    {Array.isArray(controller_data?.types) &&
                        <div className='captwiki-controller-icon-wrapper'>
                            {controller_data?.types.includes('classic') &&
                                <span className='captwiki-controller-value-icon'>
                                    <i className='captwiki-i-edit'></i>
                                </span>
                            }
                            {controller_data?.types.includes('gradient') &&
                                <span className='captwiki-controller-value-icon'>
                                    <i className='captwiki-i-background-controller'></i>
                                </span>
                            }
                        </div>
                    }
                </div>
            )
        } else if ('cssfilter' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} />
                    <span className='captwiki-controller-value-icon'>
                        <i className='captwiki-i-color-wheel-controller'></i>
                    </span>
                </div>
            )
        } else if ('divider' == controller_data?.type) {
            return (
                <hr className='captwiki-controller-separator' />
            )
        } else if ('normalhover' == controller_data?.type) {
            return (
                <div className='captwiki-controller-large'>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel',])} />
                    <div className='captwiki-normalhover-controller'>
                        <div className='captwiki-normalhover-tabs'>
                            {Array.isArray(controller_data?.nha_array) &&
                                controller_data?.nha_array.map((item, index) => (
                                    <span
                                        className={`captwiki-normalhover-tab ${item.value == controller_data?.nha_type ? 'captwiki-normalhover-tab-active' : ''}`}
                                        key={index}
                                        onClick={(e) => { e.stopPropagation(); updateValue('nha_type', item.value) }}>
                                        {item.label}
                                    </span>
                                ))}
                        </div>
                        <div className='captwiki-normalhover-content'>
                            <span className='captwiki-controller-drop'
                                onDragEnter={(e) => { e.stopPropagation(); handleDragEnter(e) }}
                                onDragLeave={(e) => { e.stopPropagation(); handleDragLeave(e) }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => { e.stopPropagation(); handleDrop(e, 0) }}
                            ></span>
                            {Array.isArray(controller_data?.fields) &&
                                controller_data?.fields.map((item, index) => {
                                    if (item?.key == section_data?.[section_data?.active_tab][section_data.active_section]?.controllers?.[props.index]?.nha_type) {
                                        return (
                                            <Fragment key={index}>
                                                <ControllerStructure controller={item} index={index} parent_index={props.index} section_index={props.section_index} />
                                                <span className='captwiki-controller-drop'
                                                    onDragEnter={(e) => { e.stopPropagation(); handleDragEnter(e) }}
                                                    onDragLeave={(e) => { e.stopPropagation(); handleDragLeave(e) }}
                                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    onDrop={(e) => { e.stopPropagation(); handleDrop(e, index + 1) }}
                                                ></span>
                                            </Fragment>
                                        )
                                    }
                                }
                                )}
                            <span className='captwiki-add-controller'
                                onDragEnter={(e) => { e.stopPropagation(); e.target.classList.add('captwiki-add-controller-show'); }}
                                onDragLeave={(e) => { e.stopPropagation(); e.target.classList.remove('captwiki-add-controller-show'); }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => { e.stopPropagation(); handleAddControllerDrop(e) }}
                            >
                                {__('Add Controller', 'captain-widgets-kit')}
                                <i className='captwiki-i-plus'></i>
                            </span>
                        </div>
                    </div>
                </div>
            )
        } else if ('choose' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <div className='captwiki-controller-input-container'>
                        <div className='captwiki-align-icons-wrapper'>
                            {controller_data?.align_option?.map((option, index) => {
                                return (
                                    <Tooltip key={index} content={<span className='captwiki-align-icon'><img src={`${assets_path}/svg/align/${option.align_icon}.svg`} /></span>} tooltipText={option.align_label} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        } else if ('code' == controller_data?.type) {
            return (
                <div className='captwiki-controller-large' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <CodeEditor lang={controller_data?.language ?? 'html'} value={controller_data?.defaultValue ?? ''} changeEvent={(value) => { updateValue('defaultValue', value) }} />
                </div>
            )
        } else if ('slider' == controller_data?.type) {
            return (
                <div className='captwiki-controller-large' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <div className='crafpa-controller-renge-content'>
                        <input className='captwiki-controller-range-input'
                            type="range"
                            min={getValue('min')}
                            max={getValue('max')}
                            step={getValue('step')}
                            style={{ background: `linear-gradient(to right, #4A745B 0%, #4A745B ${((controller_data.defaultValue.value - getValue('min')) * 100) / (getValue('max') - getValue('min'))}%, #e1e1e1 0%, #e1e1e1 0%)` }}
                            value={controller_data?.defaultValue?.value ?? 0}
                            onChange={(e) => { updateController('defaultValue', 'value', e.target.value) }}
                        />
                        <div className='crafpa-controller-unit-content'>
                            <div className='captwiki-controller-dropdown-item'>
                                <input className='captwiki-controller-dropdown'
                                    type="number"
                                    min={getValue('min')}
                                    max={getValue('max')}
                                    step={getValue('step')}
                                    value={controller_data?.defaultValue?.value ?? ''}
                                    onChange={(e) => { updateController('defaultValue', 'value', e.target.value) }} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if ('hover_animation' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel',])} />
                    <input className='captwiki-controller-input' type="text" value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
                </div>
            )
        } else if ('exit_animation' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel',])} />
                    <input className='captwiki-controller-input' type="text" value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
                </div>
            )
        } else if ('animation' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel',])} />
                    <input className='captwiki-controller-input' type="text" value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
                </div>
            )
        } else if ('rawhtml' == controller_data?.type) {
            return (
                <div className='captwiki-controller-large' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel'])} />
                    <textarea className='captwiki-controller-input' placeholder={controller_data?.placeHolder ?? ''} value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} rows={2} />
                </div>
            )
        } else if ('preview' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container'>
                    <input className='captwiki-controller-label' type="text" value={'Update Preview Changes'} readOnly />
                    <span className='captwiki-controller-preview-button'>{__('Update', 'captain-widgets-kit')}</span>
                </div>
            )
        } else if ('url' == controller_data?.type) {
            return (
                <div className='captwiki-controller-container' style={getStyle(['labelBlock'])}>
                    <input className='captwiki-controller-label' type="text" value={controller_data?.label ?? ''} onChange={(e) => { updateValue('label', e.target.value) }} style={getStyle(['showlabel',])} />
                    <div className='captwiki-controller-url-content'>
                        <input className='captwiki-controller-input' type="text" placeholder={controller_data?.placeHolder ?? ''} value={controller_data?.defaultValue ?? ''} onChange={(e) => { updateValue('defaultValue', e.target.value) }} />
                        <span className='captwiki-controller-setting-icon'><i className='captwiki-i-setting'></i></span>
                    </div>
                </div>
            )
        }
    }

    const checkActiveController = () => {
        if (props.section_index == section_data.active_section) {
            if (props?.parent_index || props?.parent_index == 0) {
                if (props.index == section_data.active_field) {
                    return true;
                }
            } else if (props.index == section_data.active_controller && (!section_data.active_field && section_data.active_field !== 0)) {
                return true;
            }
        }
        return false;
    }

    return (
        <Fragment>
            {'before' == controller_data?.separator && <hr className='captwiki-controller-separator' />}
            <div className={`captwiki-controller-wrapper ${checkActiveController() ? 'captwiki-controller-wrapper-active' : ''}`} onClick={(e) => { e.stopPropagation(); handleActiveController() }}>
                {innerController()}
                {controller_data?.description && <span className='captwiki-controller-description'>{controller_data?.description}</span>}
                <div className='captwiki-controller-actions'>
                    {!hideEditControlls.includes(controller_data?.type) &&
                        <span className='captwiki-controller-action-btn'>
                            <i className='captwiki-i-edit'></i>
                        </span>
                    }
                    <span className='captwiki-controller-action-btn' onClick={(e) => { e.stopPropagation(); deleteController() }}>
                        <i className='captwiki-i-delete'></i>
                    </span>
                </div>
            </div>
            {'after' == controller_data?.separator && <hr className='captwiki-controller-separator' />}
        </Fragment>
    )
}

export default ControllerStructure
