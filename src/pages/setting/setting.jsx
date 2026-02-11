import React, { useState } from 'react'
import './setting.scss';
import Switcher from '../../components/switcher/switcher.jsx';
import Theme from './theme/theme.jsx';
import { Popup_structure } from '../../global/popup/popup.jsx';
import { ManageSettingData } from './setting.js';
import { __ } from '@wordpress/i18n';

const Setting = () => {

    const [showPopup, setShowPopup] = useState('')
    const [setting_data, setSettingData] = useState(cwk_data.cwk_settings);

    const setting_cards_data = [
        // switcher_type always depends on the name which we store in the database.
        {
            title: __('Cleanup Database', 'captain-widgets-kit'),
            desc: __('Cleans up all plugin data from the database when the plugin is uninstalled.', 'captain-widgets-kit'),
            type: 'switcher',
            switcher_type: 'cleanup_db',
        },
        {
            title: __('Display mode', 'captain-widgets-kit'),
            desc: __('Set light or dark mode.', 'captain-widgets-kit'),
            type: 'popup',
            popup_type: 'theme',
        },
    ]

    const handlePopup = (popup_type) => {
        let popup_data = '';

        if ('theme' == popup_type) {
            popup_data = {
                title: __('Display Mode', 'captain-widgets-kit'),
                desc: __('Set light or dark mode.', 'captain-widgets-kit'),
                body: <Theme close_popup={() => { setShowPopup('') }} />,
            }
        }

        setShowPopup(popup_data);
    }

    const handleSwitcher = async (switcher_type, value) => {

        let result = await ManageSettingData(setting_data, switcher_type, value);
        if (result.data.success) {
            setSettingData(result.data?.data);
        }
    }

    return (
        <div className='cwk-setting-page'>
            <div className='cwk-setting-item'>
                {setting_cards_data.map((data, index) => {
                    return (
                        <div className='cwk-setting-card' key={index}>
                            <div className='cwk-setting-card-content'>
                                <span className='cwk-setting-card-title'>{data.title}</span>
                                <span className='cwk-setting-card-desc'>{data.desc}</span>
                            </div>
                            {'switcher' == data?.type &&
                                <Switcher checked={setting_data[data?.switcher_type] ?? false} onChange={(e) => handleSwitcher(data?.switcher_type, e.target.checked)} />
                            }
                            {'popup' == data?.type &&
                                <span className='cwk-setting-card-icon' onClick={() => handlePopup(data?.popup_type)}>
                                    <i className='cwk-i-setting'></i>
                                </span>
                            }
                        </div>
                    )
                })}
            </div>
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

export default Setting
