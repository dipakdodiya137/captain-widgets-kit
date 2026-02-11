import React, { useState, useRef } from 'react';
import './dropdown.scss';

const Dropdown = ({ title = '', content, className = '' }) => {
    const [contentWidth, setContentWidth] = useState(0);
    const [contentPosition, setContentPosition] = useState({ top: 0 });

    const headerRef = useRef(null);
    const contentRef = useRef(null);

    const getContentStyle = () => {

        if (!headerRef.current || !contentRef.current) return;

        setContentWidth(headerRef.current.getBoundingClientRect().width - 30);

        const headerRect = headerRef.current.getBoundingClientRect();
        const topPosition = headerRect.top + headerRect.height + 5;
        const contentHeight = contentRef.current.getBoundingClientRect().height;
        const windowHeight = window.innerHeight - 5;
        const bottomPosition = topPosition + contentHeight;
        var newPosition = { ...contentPosition };

        if (bottomPosition > windowHeight) {
            newPosition.top = headerRect.top - contentHeight - 10;
        } else {
            newPosition.top = topPosition;
        }

        setContentPosition(newPosition);

        const handleResize = () => {
            getContentStyle();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    };

    const toggleDropdown = (e) => {
        const dropdownContainer = e.target.closest('.cwk-dropdown-container');

        if (!dropdownContainer) return;

        dropdownContainer.classList.toggle('cwk-dropdown-content-show');

        getContentStyle();
    };

    return (
        <div className={`cwk-dropdown-container ${className}`} ref={headerRef} onClick={toggleDropdown}>
            <div className='cwk-dropdown-header'>
                {title}
                <span className='cwk-dropdown-header-icon'>
                    <i className='cwk-i-arrow-down'></i>
                </span>
            </div>
            <div
                className='cwk-dropdown-content'
                ref={contentRef}
                style={{ width: contentWidth, top: contentPosition.top }}
            >
                {content}
            </div>
        </div>
    );
};

export default Dropdown;
