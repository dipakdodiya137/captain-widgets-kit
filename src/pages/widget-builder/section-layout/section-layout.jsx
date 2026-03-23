import { Fragment, useEffect, useRef } from 'react';
import Accordion from '../../../global/accordion/accordion.jsx';
import { getControllerVariable, UniqueID } from '../../../global/elements.js';
import { handleSectionData } from '../../../redux/slice.jsx';
import ControllerStructure from '../controller-data/controller-structure.jsx';
import './section-layout.scss';
import { useDispatch, useSelector } from 'react-redux';
import { drag_controller_data } from '../controller-listing/controller-listing.jsx';
import { controller_array } from '../controller-data/controller-array.js';
import Tooltip from '../../../components/tooltip/tooltip.jsx';
import { __ } from '@wordpress/i18n';

const SectionLayout = () => {

    const section_data = useSelector((state) => state?.controller_section);
    const widget_info = useSelector((state) => state?.widget_info);
    const dispatch = useDispatch();
    const layoutRef = useRef(null);

    useEffect(() => {

        if (!layoutRef.current) {
            return;
        }

        if (section_data?.section_collapsed) {
            layoutRef.current.classList.add('captwiki-controller-layout-collapsed');
            if (layoutRef.current.classList.contains('captwiki-controller-layout-expaned')) {
                layoutRef.current.classList.remove('captwiki-controller-layout-expaned');
            }
            setTimeout(() => {
                layoutRef.current.style.display = 'none';
            }, 300);
        } else {
            layoutRef.current.style.display = 'flex';
            setTimeout(() => {
                layoutRef.current.classList.remove('captwiki-controller-layout-collapsed');
                if (section_data?.editor_collapsed) {
                    layoutRef.current.classList.add('captwiki-controller-layout-expaned');
                }
            }, 0);
        }
    }, [section_data?.section_collapsed])

    useEffect(() => {
        if (!layoutRef.current || section_data?.section_collapsed) {
            return;
        }

        if (section_data?.editor_collapsed) {
            layoutRef.current.classList.add('captwiki-controller-layout-expaned');
        } else {
            layoutRef.current.style.display = 'flex';
            setTimeout(() => {
                if (layoutRef.current.classList.contains('captwiki-controller-layout-expaned')) {
                    layoutRef.current.classList.remove('captwiki-controller-layout-expaned');
                }
            }, 0);
        }
    }, [section_data?.editor_collapsed])

    const AddSection = (controller) => {
        let new_section_name = 'Section-1';

        if (section_data?.[section_data?.active_tab]?.length > 0) {
            new_section_name = `Section-${section_data?.[section_data?.active_tab]?.length + 1}`;
        }

        let new_section_data = {
            name: new_section_name,
            key: `section-${UniqueID()}`,
            controllers: [],
        }

        let redux_section_data = { ...section_data }
        redux_section_data[section_data?.active_tab] = [...redux_section_data[section_data?.active_tab], new_section_data];
        redux_section_data.active_section = redux_section_data?.[section_data?.active_tab]?.length - 1;
        redux_section_data.active_controller = null;

        if (redux_section_data?.active_field || redux_section_data?.active_field === 0) {
            redux_section_data.active_field = null;
        }

        if (controller) {
            let new_controller = { ...controller_array[controller.name], name: getControllerVariable(controller.name) }
            redux_section_data[section_data?.active_tab][redux_section_data[section_data?.active_tab].length - 1].controllers = [new_controller];
        }

        dispatch(handleSectionData(redux_section_data));
    }

    const deleteSection = (index) => {
        let redux_section_data = { ...section_data }
        redux_section_data = { ...redux_section_data, [section_data?.active_tab]: [...redux_section_data?.[section_data?.active_tab]], active_controller: null, active_field: null }
        redux_section_data[section_data?.active_tab].splice(index, 1);
        dispatch(handleSectionData(redux_section_data));
    }

    const updateSectionName = (index, name) => {

        // if (name.trim() === '') {
        //     return;
        // }

        const newLayout = [...section_data?.[section_data?.active_tab]];

        const updatedSection = { ...newLayout[index], name: name };
        newLayout[index] = updatedSection;

        const redux_section_data = { ...section_data, [section_data?.active_tab]: newLayout };

        dispatch(handleSectionData(redux_section_data));
    };

    const handleActiveSection = (index, notNull = false) => {
        let redux_section_data = { ...section_data }
        if (redux_section_data?.active_section === index && !notNull) {
            redux_section_data.active_section = null;
        } else {
            redux_section_data.active_section = index;
        }

        redux_section_data.active_controller = null;

        if (redux_section_data?.active_field || redux_section_data?.active_field === 0) {
            redux_section_data.active_field = null;
        }
        dispatch(handleSectionData(redux_section_data));
    }

    const handleDragEnter = (e) => {
        if (e.target.classList.contains('captwiki-controller-drop')) {
            e.target.classList.add('captwiki-controller-drop-show');
        }
    }

    const handleDragLeave = (e) => {
        if (e.target.classList.contains('captwiki-controller-drop')) {
            e.target.classList.remove('captwiki-controller-drop-show');
        }
    }

    const AddController = (controller, index) => {

        let redux_section_data = { ...section_data }

        const activeIndex = section_data.active_section ?? 0;
        const newLayout = [...redux_section_data?.[section_data?.active_tab]];
        let new_controller = { ...controller_array[controller.name], name: getControllerVariable(controller.name) }

        const activeSection = {
            ...newLayout[activeIndex],
            controllers: [...newLayout[activeIndex].controllers]
        };
        activeSection.controllers.splice(index, 0, new_controller);

        newLayout[activeIndex] = activeSection;
        redux_section_data[section_data?.active_tab] = newLayout;
        redux_section_data.active_section = activeIndex;

        dispatch(handleSectionData(redux_section_data));
    }

    const handleDrop = (e, index) => {

        const controller = drag_controller_data.get('captwiki-controller');

        if (controller) {
            AddController(controller, index);
        }

        if (e.target.classList.contains('captwiki-controller-drop')) {
            e.target.classList.remove('captwiki-controller-drop-show');
        }
    }

    const handleAddControllerDrop = (e) => {

        const controller = drag_controller_data.get('captwiki-controller');



        if (controller) {
            AddController(controller, section_data?.[section_data?.active_tab][section_data.active_section]?.controllers?.length ?? 0);
        }

        if (e.target.classList.contains('captwiki-add-controller')) {
            e.target.classList.remove('captwiki-add-controller-show');
        }
    }

    const SectionDragEnter = (e) => {
        if (e.target.classList.contains('captwiki-add-layout')) {
            e.target.classList.add('captwiki-add-layout-show');
        }
    }

    const SectionDragLeave = (e) => {
        if (e.target.classList.contains('captwiki-add-layout')) {
            e.target.classList.remove('captwiki-add-layout-show');
        }
    }

    const SectionDrop = (e) => {

        const controller = drag_controller_data.get('captwiki-controller');

        if (controller) {
            AddSection(controller);
        }

        if (e.target.classList.contains('captwiki-add-layout')) {
            e.target.classList.remove('captwiki-add-layout-show');
        }
    }

    const section_header = (name, index) => {

        return (
            <div className='captwiki-section-header' onClick={(e) => { if (section_data.active_section !== index) handleActiveSection(index) }}>
                <input type="text" value={name} className='captwiki-section-name'
                    onFocus={(e) => { e.stopPropagation(); }}
                    onChange={(e) => { e.stopPropagation(); updateSectionName(index, e.target.value) }} />
                <div className='captwiki-section-icons'>
                    <span className='captwiki-accordion-header-icon' onClick={(e) => { handleActiveSection(index) }}>
                        <i className='captwiki-i-arrow-down'></i>
                    </span>
                    <span className='captwiki-section-del-icon' onClick={(e) => { e.stopPropagation(); deleteSection(index) }}>
                        <i className='captwiki-i-delete'></i>
                    </span>
                </div>
            </div>
        )
    }

    const section_content = (section_details, index) => {

        return (
            <div className='captwiki-section-content'>
                <span className='captwiki-controller-drop'
                    onDragEnter={(e) => { e.stopPropagation(); handleDragEnter(e) }}
                    onDragLeave={(e) => { e.stopPropagation(); handleDragLeave(e) }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => { e.stopPropagation(); handleDrop(e, 0) }}
                ></span>
                {Array.isArray(section_details.controllers) && section_details.controllers?.length > 0 &&
                    section_details.controllers.map((controller, controller_index) => {
                        return (
                            <Fragment key={controller_index}>
                                <ControllerStructure controller={controller} index={controller_index} section_index={index} />
                                <span className='captwiki-controller-drop'
                                    onDragEnter={(e) => { e.stopPropagation(); handleDragEnter(e) }}
                                    onDragLeave={(e) => { e.stopPropagation(); handleDragLeave(e) }}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => { e.stopPropagation(); handleDrop(e, controller_index + 1) }}
                                ></span>
                            </Fragment>
                        )
                    })
                }
                <span className='captwiki-add-controller'
                    onDragEnter={(e) => { e.stopPropagation(); e.target.classList.add('captwiki-add-controller-show'); }}
                    onDragLeave={(e) => { e.stopPropagation(); e.target.classList.remove('captwiki-add-controller-show'); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => { e.stopPropagation(); handleAddControllerDrop(e, index) }}
                >
                    {__('Add Controller', 'captain-widgets-kit')}
                    <i className='captwiki-i-plus'></i>
                </span>
            </div>
        )
    }


    const external_section = (name, index) => {

        const cleanText = () => {
            return name.replace(/<[^>]*>/g, '').trim() || '';
        }

        return (
            <div className='captwiki-section-header'>
                <input type="text" value={cleanText()} className='captwiki-section-name' readOnly />
                <div className='captwiki-section-icons'>
                    <div className='captwiki-info-header-tooltip'>
                        <Tooltip
                            content={
                                <span className='captwiki-info-header-icon'>
                                    <i className='captwiki-i-information-1'></i>
                                </span>
                            }
                            tooltipText={__(`This is section of ${widget_info?.selected_widget?.name} you can't edit it from here.`, 'captain-widgets-kit')}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const getClassName = (type) => {

        if (type == section_data?.active_tab) {
            return 'captwiki-controller-action-btn captwiki-controller-action-btn-active';

        }
        return 'captwiki-controller-action-btn';
    }

    const handleActiveTab = (tab) => {
        let redux_section_data = { ...section_data }

        if (!(redux_section_data?.[tab]) || !Array.isArray(redux_section_data?.[tab])) {
            redux_section_data[tab] = [];
        }

        redux_section_data.active_tab = tab;
        redux_section_data.active_controller = null;

        if (redux_section_data?.active_field || redux_section_data?.active_field === 0) {
            redux_section_data.active_field = null;
        }

        dispatch(handleSectionData(redux_section_data));
    }

    return (
        <div className='captwiki-controller-layout' ref={layoutRef}>
            <div className='captwiki-controller-layout-header-wrapper'>
                <div className='captwiki-controller-layout-header'>
                    {'container' == widget_info?.effect_type ?
                        <span className={getClassName('layout')} onClick={() => { handleActiveTab('layout') }}>{__('Layout', 'captain-widgets-kit')}</span>
                        :
                        <span className={getClassName('content')} onClick={() => { handleActiveTab('content') }}>{__('Content', 'captain-widgets-kit')}</span>
                    }
                    <span className={getClassName('style')} onClick={() => { handleActiveTab('style') }}>{__('Style', 'captain-widgets-kit')}</span>
                    <span className={getClassName('advanced')} onClick={() => { handleActiveTab('advanced') }}>{__('Advanced', 'captain-widgets-kit')}</span>
                </div>
            </div>
            <div className='captwiki-section-container'>
                {Array.isArray(section_data?.[section_data?.active_tab]) && section_data?.[section_data?.active_tab]?.length > 0 &&
                    <div className='captwiki-section-listing'>
                        {
                            section_data?.[section_data?.active_tab]?.map((section_details, index) => {
                                if (section_details?.isExternal || section_details?.isExternel) {
                                    return (
                                        <div className='captwiki-section-accordion' key={index}>
                                            {external_section(section_details?.name, index)}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div
                                            key={index}
                                            className={`captwiki-section-accordion ${section_data?.active_section === index ? 'captwiki-section-accordion-active' : ''}`}
                                            onDragEnter={(e) => { handleActiveSection(index, true) }}>
                                            {section_header(section_details?.name, index)}
                                            {section_data?.active_section === index && section_content(section_details, index)}
                                        </div>
                                    )
                                }

                            })
                        }
                    </div>
                }
                <div className='captwiki-add-layout'
                    onClick={() => { AddSection() }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDragEnter={(e) => { e.stopPropagation(); SectionDragEnter(e) }}
                    onDragLeave={(e) => { e.stopPropagation(); SectionDragLeave(e) }}
                    onDrop={(e) => { e.stopPropagation(); SectionDrop(e) }}
                >
                    {__('Add Section', 'captain-widgets-kit')}
                    <i className='captwiki-i-plus'></i>
                </div>
            </div>
        </div>
    )

}

export default SectionLayout
