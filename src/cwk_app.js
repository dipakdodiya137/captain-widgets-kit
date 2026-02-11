import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import routes from './router/routes.js';
import CheckUrl from './router/CheckUrl.js';
import Navigation from './pages/navigation/navigation.jsx';
import { handleSettings } from './redux/slice.jsx';
import { useDispatch } from 'react-redux';
import Toast from './global/toast/toast.jsx';

const Cwk_app = () => {

    const dispatch = useDispatch();

    const handleCloseEvent = (e) => {
        let drop_down = document.querySelectorAll(".cwk-dropdown-container.cwk-dropdown-content-show")

        if (!(e.target.closest('.cwk-dropdown-header')) && drop_down) {
            drop_down.forEach((content) => {
                content.classList.remove("cwk-dropdown-content-show");
            })
        }
    }

    useEffect(() => {
        const cwk_app = document.getElementById('captain-widgets-kit-app');
        const wp_body = document.querySelector('#wpcontent');
        const setting_data = cwk_data.cwk_settings;

        if (cwk_app && wp_body) {
            if ('light' === setting_data.cwk_theme) {
                if (cwk_app.classList.contains('cwk-dark-mode')) {
                    cwk_app.classList.remove('cwk-dark-mode');
                }

                if (wp_body.classList.contains('cwk-wp-dark')) {
                    wp_body.classList.remove('cwk-wp-dark');
                }
            } else if ('dark' === setting_data.cwk_theme) {
                if (!cwk_app.classList.contains('cwk-dark-mode')) {
                    cwk_app.classList.add('cwk-dark-mode');
                }

                if (!wp_body.classList.contains('cwk-wp-dark')) {
                    wp_body.classList.add('cwk-wp-dark');
                }
            }
            dispatch(handleSettings(setting_data));
        }

    }, [])


    return (
        <HashRouter>
            <CheckUrl />
            <div className='cwk-app' onClick={(e) => { handleCloseEvent(e) }}>
                <Navigation />
                <Routes>
                    {routes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />))
                    }
                </Routes>
            </div>
            <Toast />
        </HashRouter>
    );
}

export default Cwk_app; 