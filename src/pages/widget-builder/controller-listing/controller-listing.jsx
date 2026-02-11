import React, { useEffect, useRef, useState } from 'react';
import './controller-listing.scss';
import { controller_record } from '../controller-data/controller-record';
import Accordion from '../../../global/accordion/accordion.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { controller_array } from '../controller-data/controller-array';
import { getControllerVariable, UniqueID } from '../../../global/elements.js';
import { handleSectionData } from '../../../redux/slice.jsx';
import Fields from '../controller-fields/fields.jsx';
import Filter_search from '../../../global/filter_search/filter_search.jsx';
import { __ } from '@wordpress/i18n';

export const drag_controller_data = new Map();

const ControllerListing = () => {

    const [activeSectionIndex, setActiveSectionIndex] = useState(-1)
    const [searchValue, setSearchValue] = useState('');
    const section_data = useSelector((state) => state?.controller_section);
    const dispatch = useDispatch();
    const listingRef = useRef(null);
    let get_controller_list = Object.values(controller_record.Elementor).flatMap(item => item.data);

    useEffect(() => {

        if (!listingRef.current) {
            return;
        }

        if (section_data?.controller_collapsed) {
            listingRef.current.classList.add('cwk-controller-listing-collapsed');
            if (listingRef.current.classList.contains('cwk-controller-listing-expaned')) {
                listingRef.current.classList.remove('cwk-controller-listing-expaned');
            }
            setTimeout(() => {
                listingRef.current.style.display = 'none';
            }, 300);
        } else {
            listingRef.current.style.display = 'flex';
            setTimeout(() => {
                if (listingRef.current.classList.contains('cwk-controller-listing-collapsed')) {
                    listingRef.current.classList.remove('cwk-controller-listing-collapsed');
                    if (section_data?.editor_collapsed) {
                        listingRef.current.classList.add('cwk-controller-listing-expaned');
                    }
                }
            }, 0);
        }
    }, [section_data?.controller_collapsed])

    useEffect(() => {
        if (!listingRef.current || section_data?.controller_collapsed) {
            return;
        }

        if (section_data?.editor_collapsed) {
            listingRef.current.classList.add('cwk-controller-listing-expaned');
        } else {
            listingRef.current.style.display = 'flex';
            setTimeout(() => {
                if (listingRef.current.classList.contains('cwk-controller-listing-expaned')) {
                    listingRef.current.classList.remove('cwk-controller-listing-expaned');
                }
            }, 0);
        }
    }, [section_data?.editor_collapsed])

    useEffect(() => {
        if ((section_data?.active_section || section_data?.active_section == 0) && section_data?.active_section !== activeSectionIndex) {
            setActiveSectionIndex(section_data?.active_section);
        }
    }, [section_data?.active_section])

    const controller_content = (data) => {

        if (!(Array.isArray(data)) || data.length < 0) {
            return;
        }

        const AddController = (controller) => {

            let redux_section_data = { ...section_data }
            let new_controller = { ...controller_array[controller.name], name: getControllerVariable(controller.name) }
            let pushCheck = section_data?.[section_data?.active_tab]?.findIndex(item => !item.isExternal);

            if (section_data?.[section_data?.active_tab]?.length == 0 || pushCheck == -1) {
                let new_section_data = {
                    name: 'Section-1',
                    key: `section-${UniqueID()}`,
                    controllers: [new_controller],
                }

                redux_section_data[section_data?.active_tab] = [...redux_section_data[section_data?.active_tab], new_section_data];
            } else {
                const activeIndex = activeSectionIndex ?? 0;
                const newLayout = [...redux_section_data?.[section_data?.active_tab]];
                const activeSection = { ...newLayout[activeIndex] };
                const newControllers = [...activeSection.controllers, new_controller];
                activeSection.controllers = newControllers;
                newLayout[activeIndex] = activeSection;
                redux_section_data[section_data?.active_tab] = newLayout;
                redux_section_data.active_section = activeIndex;
            }

            dispatch(handleSectionData(redux_section_data));
        }

        const handleDragStart = (controller) => {
            drag_controller_data.set('cwk-controller', controller);
        }

        const handleDragEnd = () => {
            drag_controller_data.delete('cwk-controller');
        }

        return (
            <div className='cwk-controller-content'>
                {data.map((controller, index) => {
                    return (
                        <div className='cwk-controller-content-item' key={index}
                            onClick={() => { AddController(controller) }}
                            onDragStart={() => { handleDragStart(controller) }}
                            onDragEnd={() => { handleDragEnd() }}
                            draggable={true}
                        >
                            <span className='cwk-controller-icon'>
                                <i className={controller.icon}></i>
                            </span>
                            <span className='cwk-controller-label'>{controller.label}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    const controller_header = (label, index) => {
        return (
            <div className='cwk-controller-header'>
                <span className='cwk-controller-header-label'>{label}</span>
            </div>
        )
    }

    const handleActiveController = () => {
        let new_section_data = { ...section_data }
        new_section_data.active_controller = null;

        if (section_data?.active_field || section_data?.active_field === 0) {
            new_section_data.active_field = null;
        }

        dispatch(handleSectionData(new_section_data));
    }

    const getControllerList = () => {

        if (searchValue.trim()) {

            let filtered_controller = get_controller_list.filter((controller) => {
                if (controller.label.toLowerCase().includes(searchValue.toLowerCase()) || controller.keyword.toString().includes(searchValue.toLowerCase())) {
                    return controller
                }
            });
            
            return (
                <div className='cwk-controller-listing-accordion'>
                    <Accordion header={'Searched Controllers'} content={controller_content(filtered_controller)} open={true} />
                </div>
            )
        } else {
            return (
                controller_record.Elementor.map((controller, index) => {
                    return (
                        <div className='cwk-controller-listing-accordion' key={index}>
                            <Accordion header={controller_header(controller.Name, index)} content={controller_content(controller.data)} open={index === 0} />
                        </div>
                    )
                })
            )
        }
    }

    const panel_content = () => {

        if ((section_data?.active_controller || section_data?.active_controller == 0) || (section_data?.active_field || section_data?.active_field === 0)) {
            return (
                <Fields />
            )
        } else {
            return (
                <>
                    <Filter_search searchValue={searchValue} setSearchValue={setSearchValue} />
                    {getControllerList()}
                </>
            )
        }
    }

    const getClassName = (type) => {
        if ('edit' == type) {
            if (section_data?.active_controller || section_data?.active_controller == 0) {
                return 'cwk-controller-action-btn cwk-controller-action-btn-active';
            } else {
                return 'cwk-controller-action-btn cwk-controller-action-btn-disable';
            }
        } else if ('controls' == type) {
            if (!section_data?.active_controller && section_data?.active_controller !== 0) {
                return 'cwk-controller-action-btn cwk-controller-action-btn-active';
            } else {
                return 'cwk-controller-action-btn';
            }
        } else {
            return 'cwk-controller-action-btn';
        }
    }

    return (
        <div className='cwk-controller-listing' ref={listingRef}>
            <div className='cwk-controller-listing-header-wrapper'>
                <div className='cwk-controller-listing-header'>
                    <span className={getClassName('edit')}>{__('Edit', 'captain-widgets-kit')}</span>
                    <span className={getClassName('controls')} onClick={() => { handleActiveController() }}>{__('Controls', 'captain-widgets-kit')}</span>
                </div>
            </div>
            <div className='cwk-controller-listing-content'>
                {panel_content()}
            </div>
        </div>
    )

}

export default ControllerListing
