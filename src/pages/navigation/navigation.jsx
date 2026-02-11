import React from 'react';
import './navigation.scss';
import { Link, useLocation } from 'react-router-dom';
import { __ } from '@wordpress/i18n';

const Navigation = () => {

    const location = useLocation();

    const navigation_list = [
        {
            name: __('Design Library', 'captain-widgets-kit'),
            path: '/',
        },
        {
            name: __('Create Library', 'captain-widgets-kit'),
            path: '/listing',
        },
        {
            name: __('Setting Page', 'captain-widgets-kit'),
            path: '/setting',
        },
    ]

    const check_active_route = (path) => {
        return location.pathname === path ? 'cwk-navigation-active-page' : '';
    }

    if (location.pathname.includes('edit')) {
        return;
    }
    return (
        <div className='cwk-navigation-menu'>
            <span className='cwk-navigation-menu-logo'>
                <img src={cwk_data.CWK_PD_URL + 'assets/svg/logo-section.svg'} alt='Cwk Logo' />
            </span>
            <div className='cwk-navigation-menu-list'>
                {navigation_list.map((item, index) => (
                    <Link to={item.path} key={index} className={`cwk-navigation-item-link ${check_active_route(item.path)}`}>
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Navigation
