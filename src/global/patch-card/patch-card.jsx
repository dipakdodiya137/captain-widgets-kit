import React, { Fragment, useEffect, useState } from 'react'
import './patch-card.scss';
import { Popup_structure } from '../popup/popup.jsx';
import Primary_button from '../../components/button/primary_button/primary_button.jsx';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/loader.jsx';
import ElementorFile from '../../pages/widget-builder/create-file/elementor-file.js';
import Tooltip from '../../components/tooltip/tooltip.jsx';
import { check_active_plugins, install_activate_plugin } from '../elements.js';
import { __ } from '@wordpress/i18n';

const PatchCard = (props) => {

    const [showPopup, setShowPopup] = useState('');
    const [deletePatchLoader, setDeletePatchLoader] = useState(false);
    const [downloadLoader, setDownloadLoader] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState({ check_plugin: 'loading', downloading_patch: 'loading' });
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

    useEffect(() => {
        if ('download' == showPopup?.type) {
            handlePopup(showPopup?.type);
        }
    }, [downloadStatus]);

    const delete_patch = () => {

        const deletePatch = async () => {
            setDeletePatchLoader(true);
            let form = new FormData();
            form.append('action', 'cwk_dashboard_ajax_call');
            form.append('nonce', cwk_data.cwk_nonce);
            form.append('type', 'delete_single_patch');
            form.append('folder', props.folder);
            form.append('file', props.file);

            let response = await axios.post(cwk_data.ajax_url, form);
            if (response.data.success && props.fetchData) {
                setShowPopup('');
                props.fetchData();
            }
            setDeletePatchLoader(false);
        }

        return (
            <div className='cwk-delete-patch'>
                <Primary_button text='Delete' onClick={() => { deletePatch() }} loader={deletePatchLoader} disabled={deletePatchLoader} />
            </div>
        )
    }

    const handleName = (name) => {
        let newFileName = name.toLowerCase()?.replace(/ /g, '-');
        return `${newFileName}_${props.widget_info.id}`;
    }

    const import_patch = async () => {

        let response = await ElementorFile(props.section, props.widget_info, props.widget_code);

        setTimeout(() => {
            if (response?.data?.success) {
                setDownloadStatus((prev) => ({ ...prev, downloading_patch: 'success' }));
                handlePopup('download_success');
            } else {
                setDownloadStatus((prev) => ({ ...prev, downloading_patch: 'fail' }));
            }
        }, 2000);
    }

    const downLoadPatch = async () => {

        handlePopup('download');
        setDownloadLoader(true);

        let plugins_to_verify = [props.widget_info?.selected_plugin];

        if (props.widget_info?.required_plugins) {
            plugins_to_verify = [...props.widget_info?.required_plugins, ...plugins_to_verify];
        }


        let check_plugin_status = await check_active_plugins(plugins_to_verify);

        if (Array.isArray(check_plugin_status?.data?.plugins) && check_plugin_status?.data?.plugins?.length > 0) {
            let verify_status = check_plugin_status?.data?.plugins?.filter((plugin) => plugin?.status !== 'active');

            if (Array.isArray(verify_status) && verify_status?.length > 0) {

                var result_check = true;
                var call_redirect_ajax = false

                for (const plugin of verify_status) {

                    let payload = {
                        slug: plugin?.original_slug,
                        path: plugin?.plugin_slug
                    };

                    let result = await install_activate_plugin(payload);

                    if (!(result?.data?.success)) {
                        result_check = false;
                        break;
                    }

                    if (plugin?.original_slug == 'happy-elementor-addons') {
                        call_redirect_ajax = true;
                    }
                }


                if (result_check) {

                    if (call_redirect_ajax) {
                        let form = new FormData();
                        form.append('action', 'cwk_dashboard_ajax_call');
                        form.append('type', 'prevent_ajax_redirect');
                        await axios.post(cwk_data.ajax_url, form);
                    }

                    setDownloadStatus((prev) => ({ ...prev, check_plugin: 'success' }));
                    import_patch();
                } else {
                    setDownloadStatus((prev) => ({ ...prev, check_plugin: 'fail', downloading_patch: 'fail' }));
                }

            } else {
                setDownloadStatus((prev) => ({ ...prev, check_plugin: 'success' }));
                import_patch();
            }
            setDownloadLoader(false);
        }

    }

    const Download_patch_content = () => {

        const check_plugin_detail = (type) => {

            let icon = <Loader />;
            let text = 'Installing required plugins...';


            if ('success' == downloadStatus.check_plugin) {
                icon = <svg clipRule="evenodd" fillRule="evenodd" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" textRendering="geometricPrecision" viewBox="0 0 21.0001 21.0001" xmlns="http://www.w3.org/2000/svg">
                    <path d="m10.5038 1.31775c5.07328 0 9.1876 4.11432 9.1876 9.1876s-4.11432 9.1876-9.1876 9.1876-9.1876-4.11432-9.1876-9.1876 4.11432-9.1876 9.1876-9.1876zm-1.90792 12.1718-2.24935-2.25121c-.38321-.38344-.38329-1.00872 0-1.39208.38337-.38329 1.01143-.38089 1.39201 0l1.58578 1.58702 3.94488-3.94488c.38337-.38337 1.00872-.38337 1.39201 0 .38337.38329.38282 1.00918 0 1.39201l-4.64201 4.64201c-.38282.38282-1.00872.38337-1.39201 0-.01077-.01077-.02116-.0217-.03131-.03286z" fill="#00ba00" />
                </svg>;
                text = 'Installing required plugins...';
            } else if ('fail' == downloadStatus.check_plugin) {
                icon = <svg clipRule="evenodd" fillRule="evenodd" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" textRendering="geometricPrecision" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 7l7 7M14 7l-7 7" stroke="#e10000" strokeWidth="2" strokeLinecap="round" />
                </svg>;
                text = 'Required plugins not installed';
            }

            if ('icon' == type) return icon;
            else if ('text' == type) return text;
        }

        const check_download_detail = (type) => {

            let icon = <Loader />;
            let text = 'Downloading extension...';

            if ('success' == downloadStatus.downloading_patch) {
                icon = <svg clipRule="evenodd" fillRule="evenodd" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" textRendering="geometricPrecision" viewBox="0 0 21.0001 21.0001" xmlns="http://www.w3.org/2000/svg">
                    <path d="m10.5038 1.31775c5.07328 0 9.1876 4.11432 9.1876 9.1876s-4.11432 9.1876-9.1876 9.1876-9.1876-4.11432-9.1876-9.1876 4.11432-9.1876 9.1876-9.1876zm-1.90792 12.1718-2.24935-2.25121c-.38321-.38344-.38329-1.00872 0-1.39208.38337-.38329 1.01143-.38089 1.39201 0l1.58578 1.58702 3.94488-3.94488c.38337-.38337 1.00872-.38337 1.39201 0 .38337.38329.38282 1.00918 0 1.39201l-4.64201 4.64201c-.38282.38282-1.00872.38337-1.39201 0-.01077-.01077-.02116-.0217-.03131-.03286z" fill="#00ba00" />
                </svg>;
                text = 'Downloading extension...';
            } else if ('fail' == downloadStatus.downloading_patch) {
                icon = <svg clipRule="evenodd" fillRule="evenodd" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" textRendering="geometricPrecision" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 7l7 7M14 7l-7 7" stroke="#e10000" strokeWidth="2" strokeLinecap="round" />
                </svg>;
                text = 'Downloading extension failed';
            }

            if ('icon' == type) return icon;
            else if ('text' == type) return text;
        }

        return (
            <div className='cwk-download-patch'>
                <div className='cwk-download-patch-status'>
                    <span className='cwk-download-patch-status-icon'>
                        {check_plugin_detail('icon')}
                    </span>
                    <span className='cwk-download-patch-status-text'>
                        {check_plugin_detail('text')}
                    </span>
                </div>
                <div className='cwk-download-patch-status'>
                    <span className='cwk-download-patch-status-icon'>
                        {check_download_detail('icon')}
                    </span>
                    <span className='cwk-download-patch-status-text'>
                        {check_download_detail('text')}
                    </span>
                </div>
            </div>
        )
    }

    const Download_success_content = () => {
        return (
            <div className='cwk-download-success-content'>
                <span className='cwk-download-success-icon'>
                    <svg enableBackground="new 0 0 512 512" height="100" width="100" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="m484.773 298.404-.149.074c-17.55 13.459-24.986 36.362-18.739 57.556l.074.149c9.964 33.686-14.723 67.668-49.823 68.561h-.148c-22.16.595-41.643 14.723-49.005 35.619v.074c-11.75 33.165-51.755 46.178-80.682 26.174-17.962-12.265-41.707-12.905-60.605 0h-.074c-28.926 19.929-68.933 6.99-80.608-26.249-7.428-20.948-26.882-35.025-49.004-35.619h-.149c-35.098-.893-59.787-34.875-49.822-68.561l.074-.149c6.245-21.194-1.191-44.097-18.739-57.556l-.149-.074c-27.886-21.417-27.886-63.356 0-84.772l.149-.074c17.548-13.459 24.984-36.363 18.665-57.556v-.149c-10.04-33.685 14.723-67.669 49.822-68.561h.149c22.085-.595 41.642-14.724 49.004-35.619v-.074c11.674-33.165 51.682-46.178 80.608-26.174h.074c18.218 12.567 42.311 12.567 60.605 0 29.218-20.177 69.001-6.792 80.682 26.174v.074c7.362 20.821 26.844 35.025 49.005 35.619h.148c35.099.892 59.787 34.876 49.823 68.561l-.074.149c-6.247 21.193 1.189 44.097 18.739 57.556l.149.074c27.886 21.416 27.886 63.356 0 84.773z" fill="#3eb655" />
                        <circle cx="256" cy="256" fill="#8bd399" r="138.517" />
                        <path d="m362.355 167.333c-23.959-19.71-54.612-31.557-88.028-31.557-76.5 0-138.55 62.05-138.55 138.55 0 33.416 11.847 64.069 31.556 88.028-30.441-25.393-49.831-63.59-49.831-106.356 0-76.501 61.997-138.497 138.497-138.497 42.766 0 80.963 19.39 106.356 49.832z" opacity=".1" />
                        <path d="m223.045 310.226-30.631-32.588c-8.022-8.536-7.608-21.957.925-29.979 8.533-8.032 21.96-7.601 29.975.929l14.622 15.55 62.153-71.038c7.704-8.816 21.104-9.71 29.927-1.995 8.816 7.715 9.706 21.111 1.995 29.927l-77.555 88.635c-8.262 9.433-22.843 9.68-31.411.559z" fill="#fff" />
                    </svg>
                </span>
                <div className='cwk-download-success-actions'>
                    <Primary_button
                        text='Browse More'
                        onClick={() => { setShowPopup(false) }}
                    />
                    <Primary_button
                        text='Edit Design'
                        onClick={() => { navigate(`/edit/${handleName(props.widget_info.name)}`) }}
                    />
                </div>
            </div>
        )
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
        } else if ('download' == type) {
            popup_details = {
                title: __('Downloading Extension', 'captain-widgets-kit'),
                desc: __('Please wait extension is downloading...', 'captain-widgets-kit'),
                type: type,
                body: <Download_patch_content />,
            }
        } else if ('download_success' == type) {
            popup_details = {
                title: __('Download Success', 'captain-widgets-kit'),
                desc: __('Extension has been downloaded successfully.', 'captain-widgets-kit'),
                type: type,
                body: <Download_success_content />,
            }
        }

        setShowPopup(popup_details);
    }

    const cardFooter = () => {
        if (props.type == 'browse_page') {
            if (downloadLoader) {
                return (
                    <span className='cwk-patch-download-loader'>
                        <Loader />
                    </span >
                )
            } else {
                return (
                    <span className='cwk-patch-download-btn' onClick={() => { downLoadPatch() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 13 12" fill="none">
                            <path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B"></path><path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B"></path>
                        </svg>
                    </span>
                )
            }
        } else {
            return (
                <div className='cwk-patch-card-footer-actions'>
                    <Link to={`/edit/${handleName(props.widget_info.name)}`} target='_blank' rel='noopener noreferrer' className='cwk-patch-card-footer-button'>
                        <i className='cwk-i-edit'></i>
                    </Link>
                    <span className='cwk-patch-card-footer-button' onClick={() => { handlePopup('delete_patch') }}>
                        <i className='cwk-i-delete'></i>
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
            <img className='cwk-card-plugin-icon' src={`${cwk_data.CWK_PD_URL}/assets/svg/plugin/${plugin_logo}${logo_ext}`} alt={plugin_logo} />
        )
    }

    return (
        <div className='cwk-patch-card-container'>
            <div className='cwk-patch-card'>
                <div className='cwk-patch-card-header'>
                    <div className='cwk-patch-card-title-wrapper'>
                        <span className='cwk-patch-card-title'>{props.widget_info.name}</span>
                        <div className='cwk-card-plugin-wrapper'>
                            <Tooltip
                                content={(
                                    <span className='cwk-card-plugin'>
                                        {getPluginIcon(props.widget_info?.selected_plugin?.plugin_name)}
                                    </span>
                                )}
                                tooltipText={props.widget_info?.selected_plugin?.plugin_name || 'Elementor'}
                            />
                        </div>
                    </div>
                    {props.widget_info.description &&
                        <span className='cwk-patch-card-header-description'>{props.widget_info.description}</span>
                    }
                </div>
                <div className='cwk-patch-card-footer'>
                    <div className='cwk-patch-card-effect-type-wrapper'>
                        <span className='cwk-patch-card-effect-type'>
                            {props.widget_info?.effect_type}
                        </span>
                        {'widget' == props.widget_info?.effect_type &&
                            <span className='cwk-patch-card-effect-type'>
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