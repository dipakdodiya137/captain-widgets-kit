import { useEffect, useState } from 'react';
import axios from 'axios';
import './popup.scss'

export const Popup_structure = (props) => {
    const [ongoingAjaxCalls, setOngoingAjaxCalls] = useState(false);
    let title = props?.title ? props.title : '';
    let desc = props?.desc ? props.desc : '';

    const Close_popup = (event) => {
        if (!event?.target?.closest('.cwk-popup-content') || event?.target?.closest('.cwk-popup-close')) {
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
        <div className="cwk-popup-outer" onClick={(e) => { if (!ongoingAjaxCalls) Close_popup(e) }}>
            <div className={`cwk-popup-content ${props?.className}`}>
                <span className='cwk-popup-close' onClick={(e) => { Close_popup(e) }}>
                    <i className='cwk-i-close'></i>
                </span>
                {(title || desc) && (
                    <div className="cwk-popup-header">
                        <span className="cwk-popup-header-title">{title}</span>
                        <span className="cwk-popup-header-desc">{desc}</span>
                    </div>
                )}
                <div className="cwk-popup-body">{props?.body}</div>
            </div>
        </div>
    );
}