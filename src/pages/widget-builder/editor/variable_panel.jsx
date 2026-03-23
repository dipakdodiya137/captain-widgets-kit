import React, { useRef } from 'react'
import './variable_panel.scss'
import { useDispatch, useSelector } from 'react-redux';
import { copyToClipboard } from '../../../global/elements';
import { handleToastMessage } from '../../../redux/slice.jsx';
import { __ } from '@wordpress/i18n';

const Variable_panel = () => {

    const variable_ref = useRef(null);
    const dispatch = useDispatch();
    const section_data = useSelector((state) => state?.controller_section);
    const widget_info = useSelector((state) => state?.widget_info);
    let exclude_controllers = ['align', 'hidden', 'dimension', 'rawhtml', 'divider', 'choose', 'background', 'border', 'boxshadow', 'textshadow', 'cssfilter', 'typography', 'preview', 'gradientcolor', 'normalhover'];


    const toggleVariablePanel = () => {

        const variable_content = variable_ref.current.querySelector('.captwiki-variable-panel-content');

        if (variable_ref.current.classList.contains('captwiki-variable-panel-show')) {
            variable_ref.current.classList.remove('captwiki-variable-panel-show');

            setTimeout(() => {
                variable_content.style.display = 'none';
            }, 300);
        } else {
            variable_content.style.display = 'flex';

            setTimeout(() => {
                variable_ref.current.classList.add('captwiki-variable-panel-show');
            }, 0);
        }
    }

    const variable_list = () => {

        let section_list = section_data?.content;
        let variable_list = [];

        if (widget_info?.effect_type == 'container' && Array.isArray(section_data?.layout)) {
            section_list = section_data?.layout;
        }

        if (Array.isArray(section_list) && section_list?.length > 0) {
            section_list.map((section) => {
                if (Array.isArray(section?.controllers) && section?.controllers?.length > 0) {
                    section?.controllers.map((controller) => {
                        if (!exclude_controllers.includes(controller?.type)) {
                            variable_list.push(controller);
                        }
                    })
                }
            })
        }

        const insertVariable = (variable_name) => {
            copyToClipboard(`{{${variable_name}}}`);

            const toast_message = {
                title: 'Variable Name Copied',
                desc: `${variable_name} has been copied to your clipboard.`,
            }

            dispatch(handleToastMessage(toast_message));
        }

        return (
            <div className='captwiki-variable-panel-content'>
                {variable_list?.length > 0 && variable_list.map((item, index) => {
                    return (
                        <span className='captwiki-variable-content-item' key={index} onClick={() => { insertVariable(item.name) }}>{`{{${item?.name}}}`}</span>
                    )
                })}
            </div>
        )

    }

    return (
        <div className='captwiki-variable-panel' ref={variable_ref}>
            <div className='captwiki-variable-panel-header' onClick={() => toggleVariablePanel()}>
                <span className='captwiki-variable-panel-header-title'>{__('Variables', 'captain-widgets-kit')}</span>
                <span className='captwiki-variable-panel-header-icon'>
                    <i className='captwiki-i-arrow-down'></i>
                </span>
            </div>
            {variable_list()}
        </div>
    )
}

export default Variable_panel;