import React, { useState } from 'react'
import './theme.scss';
import Dropdown from '/src/global/dropdown/dropdown.jsx';
import Primary_button from '/src/components/button/primary_button/primary_button.jsx';
import { handleSettings } from '../../../redux/slice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { ManageSettingData } from '../setting.js';
import { __ } from '@wordpress/i18n';

const Theme = (props) => {

    const setting_data = useSelector((state) => state?.cwk_settings);
    const dispatch = useDispatch();
    const [theme, setTheme] = useState(setting_data?.cwk_theme ?? 'light');

    const dropdown_content = () => {
        return (
            <div className='cwk-theme-content'>
                <span className='cwk-plugin-themes' onClick={() => setTheme('light')}>{__('Light', 'captain-widgets-kit')}</span>
                <span className='cwk-plugin-themes' onClick={() => setTheme('dark')}>{__('Dark', 'captain-widgets-kit')}</span>
            </div>
        )
    }

    const save_theme = async () => {

        const cwk_app = document.getElementById('captain-widgets-kit-app');
        const wp_body = document.querySelector('#wpcontent');

        if (cwk_app && wp_body) {

            let result = await ManageSettingData(setting_data, 'cwk_theme', theme);
            if (result.data.success) {
                if ('light' === theme) {
                    if (cwk_app.classList.contains('cwk-dark-mode')) {
                        cwk_app.classList.remove('cwk-dark-mode');
                    }

                    if (wp_body.classList.contains('cwk-wp-dark')) {
                        wp_body.classList.remove('cwk-wp-dark');
                    }
                } else if ('dark' === theme) {
                    if (!cwk_app.classList.contains('cwk-dark-mode')) {
                        cwk_app.classList.add('cwk-dark-mode');
                    }

                    if (!wp_body.classList.contains('cwk-wp-dark')) {
                        wp_body.classList.add('cwk-wp-dark');
                    }
                }

                dispatch(handleSettings(result.data?.data));
                props.close_popup();
            }
        }
    }

    return (
        <div className='cwk-theme-wrapper'>
            <div className='cwk-theme-container'>
                <span className='cwk-theme-title'>{__('Select Mode', 'captain-widgets-kit')}</span>
                <div className='cwk-theme-dropdown'>
                    <Dropdown
                        title={theme}
                        content={dropdown_content()}
                    />
                </div>
            </div>
            <div className='cwk-theme-save'>
                <Primary_button text={__('Save Theme', 'captain-widgets-kit')} onClick={() => { save_theme() }} />
            </div>
        </div>
    )
}

export default Theme;