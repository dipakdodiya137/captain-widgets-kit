import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import routes from './router/routes.js';
import CheckUrl from './router/CheckUrl.js';
import Navigation from './pages/navigation/navigation.jsx';
import { handleSettings } from './redux/slice.jsx';
import { useDispatch } from 'react-redux';
import Toast from './global/toast/toast.jsx';

const Captwiki_app = () => {

    const dispatch = useDispatch();

    const handleCloseEvent = (e) => {
        let drop_down = document.querySelectorAll(".captwiki-dropdown-container.captwiki-dropdown-content-show")

        if (!(e.target.closest('.captwiki-dropdown-header')) && drop_down) {
            drop_down.forEach((content) => {
                content.classList.remove("captwiki-dropdown-content-show");
            })
        }
    }

    useEffect(() => {
        const captwiki_app = document.getElementById('captain-widgets-kit-app');
        const wp_body = document.querySelector('#wpcontent');
        const setting_data = captwiki_data.captwiki_settings;

        if (captwiki_app && wp_body) {
            if ('light' === setting_data.captwiki_theme) {
                if (captwiki_app.classList.contains('captwiki-dark-mode')) {
                    captwiki_app.classList.remove('captwiki-dark-mode');
                }

                if (wp_body.classList.contains('captwiki-wp-dark')) {
                    wp_body.classList.remove('captwiki-wp-dark');
                }
            } else if ('dark' === setting_data.captwiki_theme) {
                if (!captwiki_app.classList.contains('captwiki-dark-mode')) {
                    captwiki_app.classList.add('captwiki-dark-mode');
                }

                if (!wp_body.classList.contains('captwiki-wp-dark')) {
                    wp_body.classList.add('captwiki-wp-dark');
                }
            }
            dispatch(handleSettings(setting_data));
        }

    }, [])


    return (
        <HashRouter>
            <CheckUrl />
            <div className='captwiki-app' onClick={(e) => { handleCloseEvent(e) }}>
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

export default Captwiki_app; 