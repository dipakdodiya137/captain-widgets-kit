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

            if (filterRef.current.classList.contains('cwk-filter-panel-show')) {
                filterRef.current.classList.remove('cwk-filter-panel-show');

                setTimeout(() => {
                    filterRef.current.style.display = 'none';
                }, 300);

            } else {

                filterRef.current.style.display = 'flex';

                setTimeout(() => {
                    filterRef.current.classList.add('cwk-filter-panel-show');
                }, 0);
            }

        }
    }

    const closeFilter = (e) => {
        if (!e.target.closest('.cwk-filter-content') && mediaQuery.matches) {
            toggleFilter();
        }
    }

    return (
        <div className={`cwk-filter-panel ${!mediaQuery.matches ? 'cwk-filter-panel-show' : ''}`} ref={filterRef} onClick={(e) => closeFilter(e)}>
            {filterContent}
        </div>
    )
}

export default filter_panel
