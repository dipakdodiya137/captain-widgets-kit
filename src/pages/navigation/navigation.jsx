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
        return location.pathname === path ? 'captwiki-navigation-active-page' : '';
    }

    if (location.pathname.includes('edit')) {
        return;
    }
    return (
        <div className='captwiki-navigation-menu'>
            <span className='captwiki-navigation-menu-logo'>
                <img src={captwiki_data.captwiki_url + 'assets/svg/logo-section.svg'} alt='Captwiki Logo' />
            </span>
            <div className='captwiki-navigation-menu-list'>
                {navigation_list.map((item, index) => (
                    <Link to={item.path} key={index} className={`captwiki-navigation-item-link ${check_active_route(item.path)}`}>
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Navigation
