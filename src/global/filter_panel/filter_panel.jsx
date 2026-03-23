import React, { useEffect, useRef } from 'react';
import './filter_panel.scss'

const filter_panel = ({ collapse, filterContent }) => {

    const filterRef = useRef(null);
    const isFirstRender = useRef(true);
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        toggleFilter();
    }, [collapse]);


    const toggleFilter = () => {
        if (filterRef.current) {

            if (filterRef.current.classList.contains('captwiki-filter-panel-show')) {
                filterRef.current.classList.remove('captwiki-filter-panel-show');

                setTimeout(() => {
                    filterRef.current.style.display = 'none';
                }, 300);

            } else {

                filterRef.current.style.display = 'flex';

                setTimeout(() => {
                    filterRef.current.classList.add('captwiki-filter-panel-show');
                }, 0);
            }

        }
    }

    const closeFilter = (e) => {
        if (!e.target.closest('.captwiki-filter-content') && mediaQuery.matches) {
            toggleFilter();
        }
    }

    return (
        <div className={`captwiki-filter-panel ${!mediaQuery.matches ? 'captwiki-filter-panel-show' : ''}`} ref={filterRef} onClick={(e) => closeFilter(e)}>
            {filterContent}
        </div>
    )
}

export default filter_panel
