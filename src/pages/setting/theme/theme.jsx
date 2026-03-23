import React, { useState } from 'react'
import './theme.scss';
import Dropdown from '/src/global/dropdown/dropdown.jsx';
import Primary_button from '/src/components/button/primary_button/primary_button.jsx';
import { handleSettings } from '../../../redux/slice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { ManageSettingData } from '../setting.js';
import { __ } from '@wordpress/i18n';

const Theme = (props) => {

    const setting_data = useSelector((state) => state?.captwiki_settings);
    const dispatch = useDispatch();
    const [theme, setTheme] = useState(setting_data?.captwiki_theme ?? 'light');

    const dropdown_content = () => {
        return (
            <div className='captwiki-theme-content'>
                <span className='captwiki-plugin-themes' onClick={() => setTheme('light')}>{__('Light', 'captain-widgets-kit')}</span>
                <span className='captwiki-plugin-themes' onClick={() => setTheme('dark')}>{__('Dark', 'captain-widgets-kit')}</span>
            </div>
        )
    }

    const save_theme = async () => {

        const captwiki_app = document.getElementById('captain-widgets-kit-app');
        const wp_body = document.querySelector('#wpcontent');

        if (captwiki_app && wp_body) {

            let result = await ManageSettingData(setting_data, 'captwiki_theme', theme);
            if (result.data.success) {
                if ('light' === theme) {
                    if (captwiki_app.classList.contains('captwiki-dark-mode')) {
                        captwiki_app.classList.remove('captwiki-dark-mode');
                    }

                    if (wp_body.classList.contains('captwiki-wp-dark')) {
                        wp_body.classList.remove('captwiki-wp-dark');
                    }
                } else if ('dark' === theme) {
                    if (!captwiki_app.classList.contains('captwiki-dark-mode')) {
                        captwiki_app.classList.add('captwiki-dark-mode');
                    }

                    if (!wp_body.classList.contains('captwiki-wp-dark')) {
                        wp_body.classList.add('captwiki-wp-dark');
                    }
                }

                dispatch(handleSettings(result.data?.data));
                props.close_popup();
            }
        }
    }

    return (
        <div className='captwiki-theme-wrapper'>
            <div className='captwiki-theme-container'>
                <span className='captwiki-theme-title'>{__('Select Mode', 'captain-widgets-kit')}</span>
                <div className='captwiki-theme-dropdown'>
                    <Dropdown
                        title={theme}
                        content={dropdown_content()}
                    />
                </div>
            </div>
            <div className='captwiki-theme-save'>
                <Primary_button text={__('Save Theme', 'captain-widgets-kit')} onClick={() => { save_theme() }} />
            </div>
        </div>
    )
}

export default Theme;