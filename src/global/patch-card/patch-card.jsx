import React, { Fragment, useEffect, useState } from 'react'
import './patch-card.scss';
import { Popup_structure } from '../popup/popup.jsx';
import Primary_button from '../../components/button/primary_button/primary_button.jsx';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/loader.jsx';
import Tooltip from '../../components/tooltip/tooltip.jsx';
import { check_active_plugins, install_activate_plugin } from '../elements.js';
import { __ } from '@wordpress/i18n';
import Switcher from '../../components/switcher/switcher.jsx';
import { ManageSettingData } from '../../pages/setting/setting.js';
import { useDispatch, useSelector } from 'react-redux';
import { handleSettings } from '../../redux/slice.jsx';

const PatchCard = (props) => {

    const [showPopup, setShowPopup] = useState('');
    const [deletePatchLoader, setDeletePatchLoader] = useState(false);
    const [downloadLoader, setDownloadLoader] = useState(false);
    const dispatch = useDispatch();
    const setting_data = useSelector((state) => state.captwiki_settings)

    const navigate = useNavigate();

    const plugin_detail = [
        {
            'name': 'elementor',
            'label': 'elementor',
            'original_slug': 'elementor',
            'plugin_slug': 'elementor/elementor.php',
            'type': 'plugin',
            'freepro': '0',
        },
    ];

    const handleSwitcher = async () => {

        let swticher_data = [...setting_data['browse_extensions'] ?? []];

        if (swticher_data.includes(props.widget_info?.id)) {
            swticher_data = swticher_data.filter(item => item !== props.widget_info?.id);
        } else {
            swticher_data.push(props.widget_info?.id);
        }

        let result = await ManageSettingData(setting_data, 'browse_extensions', swticher_data);
        
        if (result.data.success) {
            dispatch(handleSettings(result.data?.data));
        }
    }

    const delete_patch = () => {

        const deletePatch = async () => {
            setDeletePatchLoader(true);
            let form = new FormData();
            form.append('action', 'captwiki_dashboard_ajax_call');
            form.append('nonce', captwiki_data.captwiki_nonce);
            form.append('type', 'delete_single_patch');
            form.append('folder', props.folder);
            form.append('file', props.file);

            if (!props.folder) {
                return null;
            }

            let response = await axios.post(captwiki_data.ajax_url, form);
            if (response.data.success && props.fetchData) {
                setShowPopup('');
                props.fetchData();
            }
            setDeletePatchLoader(false);
        }

        return (
            <div className='captwiki-delete-patch'>
                <Primary_button text='Delete' onClick={() => { deletePatch() }} loader={deletePatchLoader} disabled={deletePatchLoader} />
            </div>
        )
    }

    const handleName = (name) => {
        let newFileName = name.toLowerCase()?.replace(/ /g, '-');
        return `${newFileName}_${props.widget_info.id}`;
    }

    const handlePopup = (type) => {
        let popup_details = '';

        if ('delete_patch' == type) {
            popup_details = {
                title: __('Delete Extension', 'captain-widgets-kit'),
                desc: __('Are you sure you want to delete this ?', 'captain-widgets-kit'),
                body: delete_patch(),
                type: type,
            }
        }

        setShowPopup(popup_details);
    }

    const cardFooter = () => {
        if (props.type == 'browse_page') {
            if (downloadLoader) {
                return (
                    <span className='captwiki-patch-download-loader'>
                        <Loader />
                    </span >
                )
            } else {
                return (
                    <Switcher checked={setting_data['browse_extensions']?.includes(props?.widget_info?.id) ?? false} onChange={() => handleSwitcher()} />
                )
            }
        } else {
            return (
                <div className='captwiki-patch-card-footer-actions'>
                    <Link to={`/edit/${handleName(props.widget_info.name)}`} target='_blank' rel='noopener noreferrer' className='captwiki-patch-card-footer-button'>
                        <i className='captwiki-i-edit'></i>
                    </Link>
                    <span className='captwiki-patch-card-footer-button' onClick={() => { handlePopup('delete_patch') }}>
                        <i className='captwiki-i-delete'></i>
                    </span>
                </div>
            )
        }
    }

    const getPluginIcon = (plugin_name) => {

        var plugin_logo = 'elementor';
        var logo_ext = '.svg';

        if ('widget' == props.widget_info?.effect_type) {
            plugin_logo = plugin_name?.toLowerCase()?.replace(/ /g, '-');
        }

        if ('happy-elementor-addons' == plugin_logo || 'royal-elementor-addons' == plugin_logo) {
            logo_ext = '.png';
        }

        return (
            <img className='captwiki-card-plugin-icon' src={`${captwiki_data.captwiki_url}/assets/svg/plugin/${plugin_logo}${logo_ext}`} alt={plugin_logo} />
        )
    }

    return (
        <div className='captwiki-patch-card-container'>
            <div className='captwiki-patch-card'>
                <div className='captwiki-patch-card-header'>
                    <div className='captwiki-patch-card-title-wrapper'>
                        <span className='captwiki-patch-card-title'>{props.widget_info.name}</span>
                        <div className='captwiki-card-plugin-wrapper'>
                            <Tooltip
                                content={(
                                    <span className='captwiki-card-plugin'>
                                        {getPluginIcon(props.widget_info?.selected_plugin?.plugin_name)}
                                    </span>
                                )}
                                tooltipText={props.widget_info?.selected_plugin?.plugin_name || 'Elementor'}
                            />
                        </div>
                    </div>
                    {props.widget_info.description &&
                        <span className='captwiki-patch-card-header-description'>{props.widget_info.description}</span>
                    }
                </div>
                <div className='captwiki-patch-card-footer'>
                    <div className='captwiki-patch-card-effect-type-wrapper'>
                        <span className='captwiki-patch-card-effect-type'>
                            {props.widget_info?.effect_type}
                        </span>
                        {'widget' == props.widget_info?.effect_type &&
                            <span className='captwiki-patch-card-effect-type'>
                                {props.widget_info?.selected_widget?.name}
                            </span>
                        }
                    </div>
                    {cardFooter()}
                </div>
            </div>

            {showPopup &&
                <Popup_structure
                    title={showPopup?.title}
                    desc={showPopup?.desc}
                    body={showPopup?.body}
                    close_popup={() => { setShowPopup(false) }}
                />
            }
        </div>
    )
}

export default PatchCard;