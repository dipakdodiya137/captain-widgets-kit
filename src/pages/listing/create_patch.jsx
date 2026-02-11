import React, { useEffect, useState } from 'react'
import Input_field from '../../components/input/input_field/Input_field.jsx';
import Dropdown from '../../global/dropdown/dropdown.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Primary_button from '../../components/button/primary_button/primary_button.jsx';
import ElementorFile from '../widget-builder/create-file/elementor-file.js';
import { handleSectionData, handleWidgetCode, handleWidgetInfo } from '../../redux/slice.jsx';
import { getInitialReduxState, UniqueID } from '../../global/elements.js';
import { useNavigate } from 'react-router-dom';
import './create_patch.scss';
import Tooltip from '../../components/tooltip/tooltip.jsx';
import { __ } from '@wordpress/i18n';

const Create_patch = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [search_widget, setSearchWidget] = useState('');
    const plugin_info = useSelector((state) => state.plugin_info);
    const plugin_details = useSelector((state) => state?.plugin_details);
    const section_data = useSelector((state) => state?.controller_section);
    const widget_info = useSelector((state) => state?.widget_info);
    const widget_code = useSelector((state) => state?.widget_code);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        // reset the redux state for create popup

        if ('create' === props.type && widget_info.name) {
            dispatch(handleWidgetInfo(getInitialReduxState('widget_info')));
            dispatch(handleSectionData(getInitialReduxState('section_data')));
            dispatch(handleWidgetCode(getInitialReduxState('widget_code')));
        }
    }, [])


    const handleWidgetDetails = (type, value) => {

        let new_widget_info = { ...widget_info, [type]: value };

        if ('selected_plugin' === type) {
            new_widget_info.selected_widget = {};
            setSearchWidget('');
        }

        dispatch(handleWidgetInfo(new_widget_info));
    }

    const dropdown_content = () => {

        if (plugin_details.length > 0) {
            return (
                <div className='cwk-plugin-list cwk-patch-plugins'>
                    {plugin_details.map((plugin, index) => {
                        return (
                            <span className={`cwk-plugin-list-item ${widget_info?.selected_plugin?.plugin_name === plugin?.plugin_name ? 'cwk-plugin-list-item-selected' : ''}`} key={index} onClick={() => { handleWidgetDetails('selected_plugin', plugin) }}>{plugin?.plugin_name}</span>
                        )
                    })}
                </div>
            )
        }
    };

    const dropdown_widget_content = () => {

        if (!(plugin_info?.[widget_info?.selected_plugin?.plugin_name]) || !(Array.isArray(plugin_info?.[widget_info?.selected_plugin?.plugin_name]))) {
            return;
        }

        let widget_list = plugin_info?.[widget_info?.selected_plugin?.plugin_name];

        if (search_widget?.trim()) {
            widget_list = plugin_info?.[widget_info?.selected_plugin?.plugin_name].filter((widget) => {
                return widget.name?.toLowerCase()?.includes(search_widget?.toLowerCase());
            });
        }

        return (
            <div className='cwk-create-dropdown-wrapper'>
                <Input_field
                    placeholder={__('Search Widget', 'captain-widgets-kit')}
                    value={search_widget}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    changeEvent={(e) => { setSearchWidget(e.target.value) }}
                />
                <div className='cwk-plugin-list'>
                    {widget_list.map((widget, index) => {
                        if (widget.name) {
                            return (
                                <span
                                    key={index}
                                    className={`cwk-plugin-list-item ${widget_info?.selected_widget?.name === widget.name ? 'cwk-plugin-list-item-selected' : ''}`}
                                    onClick={() => { handleWidgetDetails('selected_widget', widget) }}>
                                    {widget.name}
                                </span>
                            )
                        }
                    })}
                </div>
            </div>
        )
    }

    const select_type_content = () => {

        return (
            <div className='cwk-plugin-list cwk-patch-plugins'>
                <span className={`cwk-plugin-list-item ${widget_info?.effect_type === 'widget' ? 'cwk-plugin-list-item-selected' : ''}`} onClick={() => { handleWidgetDetails('effect_type', 'widget') }}>{__('Widget', 'captain-widgets-kit')}</span>
                <span className={`cwk-plugin-list-item ${widget_info?.effect_type === 'container' ? 'cwk-plugin-list-item-selected' : ''}`} onClick={() => { handleWidgetDetails('effect_type', 'container') }}>{__('Container', 'captain-widgets-kit')}</span>
                <span className={`cwk-plugin-list-item ${widget_info?.effect_type === 'column' ? 'cwk-plugin-list-item-selected' : ''}`} onClick={() => { handleWidgetDetails('effect_type', 'column') }}>{__('Column', 'captain-widgets-kit')}</span>
                <span className={`cwk-plugin-list-item ${widget_info?.effect_type === 'section' ? 'cwk-plugin-list-item-selected' : ''}`} onClick={() => { handleWidgetDetails('effect_type', 'section') }}>{__('Section', 'captain-widgets-kit')}</span>
            </div>
        )
    };

    const create_patch = async () => {

        setIsLoading(true);

        let widget_name = widget_info?.name.trim();

        let redux_widget_info = { ...widget_info, name: widget_name, description: widget_info?.description }

        if (widget_info?.id) {
            redux_widget_info.id = widget_info?.id;
        } else {
            redux_widget_info.id = UniqueID();
        }

        if (widget_info?.version) {
            redux_widget_info.version = widget_info?.version;
        } else {
            redux_widget_info.version = '1.0.0';
        }

        dispatch(handleWidgetInfo(redux_widget_info));

        let response = await ElementorFile(section_data, redux_widget_info, widget_code);

        if (response.data.success) {

            const handleName = (name) => {
                let newFileName = name.toLowerCase()?.replace(/ /g, '-');
                return `${newFileName}_${redux_widget_info.id}`;
            }

            navigate(`/edit/${handleName(redux_widget_info.name)}`);
            if (props.fetchData) {
                props.fetchData();
            }
            props.close_popup();
        }

        setIsLoading(false);
    }

    const check_disable_button = () => {

        if (!widget_info?.name.trim() || ('widget' == widget_info?.effect_type && (!widget_info?.selected_plugin?.plugin_name || !widget_info?.selected_widget?.name))) {
            return true;
        }

        return false;
    }

    return (
        <div className='cwk-create-patch'>
            <div className='cwk-create-details'>
                <Input_field placeholder={__('Enter Extension Name', 'captain-widgets-kit')} value={widget_info?.name} changeEvent={(e) => { handleWidgetDetails('name', e.target.value) }} />
            </div>
            <div className='cwk-create-details'>
                <Dropdown
                    title={<span className='cwk-selected-type'>{widget_info?.effect_type || __('Select Effect Type', 'captain-widgets-kit')}</span>}
                    content={select_type_content()}
                />
            </div>
            {'widget' == widget_info?.effect_type &&
                <div className='cwk-create-details'>
                    <Dropdown
                        title={widget_info?.selected_plugin?.plugin_name || __('Select Plugin', 'captain-widgets-kit')}
                        content={dropdown_content()}
                    />
                    <div
                        className={`cwk-widget-select-container ${plugin_info?.[widget_info?.selected_plugin?.plugin_name] && Array.isArray(plugin_info?.[widget_info?.selected_plugin?.plugin_name]) ? '' : 'cwk-widget-select-disable'}`}
                    >
                        <Dropdown
                            title={widget_info?.selected_widget?.name || __('Select Widget', 'captain-widgets-kit')}
                            className='cwk-widget-select-dropdown'
                            content={dropdown_widget_content()}
                        />
                    </div>
                </div>
            }
            <div className='cwk-create-footer'>
                {check_disable_button() ?
                    <Tooltip
                        content={(
                            <Primary_button text={props.btnText || __('Create', 'captain-widgets-kit')} loader={isLoading} disabled={true} />
                        )}
                        tooltipText={__('Please fill up all the fields', 'captain-widgets-kit')}
                    />
                    :
                    <Primary_button text={props.btnText || __('Create', 'captain-widgets-kit')} loader={isLoading} onClick={() => { create_patch() }} disabled={isLoading} />
                }
            </div>
        </div>
    )
}

export default Create_patch;
