import { useEffect, useState } from 'react';
import axios from 'axios';
import './popup.scss'

export const Popup_structure = (props) => {
    const [ongoingAjaxCalls, setOngoingAjaxCalls] = useState(false);
    let title = props?.title ? props.title : '';
    let desc = props?.desc ? props.desc : '';

    const Close_popup = (event) => {
        if (!event?.target?.closest('.captwiki-popup-content') || event?.target?.closest('.captwiki-popup-close')) {
            props.close_popup();
        }
    }

    axios.interceptors.request.use(function (config) {
        setOngoingAjaxCalls(true);
        return config;
    }, function (error) {
        setOngoingAjaxCalls(false);
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
        setOngoingAjaxCalls(false);
        return response;
    }, function (error) {
        setOngoingAjaxCalls(false);
        return Promise.reject(error);
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !ongoingAjaxCalls) {
                props.close_popup();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    })


    return (
        <div className="captwiki-popup-outer" onClick={(e) => { if (!ongoingAjaxCalls) Close_popup(e) }}>
            <div className={`captwiki-popup-content ${props?.className}`}>
                <span className='captwiki-popup-close' onClick={(e) => { Close_popup(e) }}>
                    <i className='captwiki-i-close'></i>
                </span>
                {(title || desc) && (
                    <div className="captwiki-popup-header">
                        <span className="captwiki-popup-header-title">{title}</span>
                        <span className="captwiki-popup-header-desc">{desc}</span>
                    </div>
                )}
                <div className="captwiki-popup-body">{props?.body}</div>
            </div>
        </div>
    );
}