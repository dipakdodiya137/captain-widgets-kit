import React, { useEffect, useRef, useState } from 'react'
import './widget-builder.scss';
import ControllerListing from './controller-listing/controller-listing.jsx';
import SectionLayout from './section-layout/section-layout.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { handleSectionData, handleWidgetCode, handleWidgetInfo } from '../../redux/slice.jsx';
import StickyTab from './sticky-tab/sticky-tab.jsx';
import { controller_array } from './controller-data/controller-array.js';
import Loader from '../../components/loader/loader.jsx';
import Wb_faq from './wb-faq/wb_faq.jsx';

const WidgetBuilder = () => {

    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const widget_info = useSelector((state) => state?.widget_info);
    const section_data = useSelector((state) => state?.controller_section);
    const widget_code = useSelector((state) => state?.widget_code);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const controlsRef = useRef(null);

    useEffect(() => {

        const body = document.querySelector('body');
        if (!body?.classList?.contains('folded')) {
            body.classList.add('folded');
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!controlsRef.current) {
            return;
        }

        if (section_data?.editor_collapsed) {
            controlsRef.current.classList.add('captwiki-wb-content-inner-expaned');
        } else {
            setTimeout(() => {
                if (controlsRef.current.classList.contains('captwiki-wb-content-inner-expaned')) {
                    controlsRef.current.classList.remove('captwiki-wb-content-inner-expaned');
                }
            }, 0);
        }
    }, [
        section_data?.editor_collapsed,
        controlsRef.current // remove after release because this is temporory solution
    ])

    const default_redux = {
        section_collapsed: false,
        controller_collapsed: false,
        editor_collapsed: true,
        active_section: null,
        active_controller: null,
        active_field: null,
    }

    const fetchData = async () => {

        let form = new FormData();
        form.append('action', 'captwiki_dashboard_ajax_call');
        form.append('type', 'get_single_patch');
        form.append('nonce', captwiki_data.captwiki_nonce);
        form.append('folder_name', id);
        form.append('file_name', id);

        let response = await axios.post(captwiki_data.ajax_url, form);

        if (response.data) {
            dispatch(handleWidgetInfo(response.data.data.widget_info));
            dispatch(handleWidgetCode(response.data.data.widget_code));

            if (response.data.data.widget_info?.selected_widget?.id && response.data.data.widget_info?.effect_type == 'widget') {
                getWidgetData(response.data.data.widget_info?.selected_widget, response.data.data.section);
            } else {
                let new_section_data = { ...response.data.data.section, ...default_redux }

                if ('container' == response.data.data.widget_info?.effect_type) {
                    new_section_data.active_tab = 'layout';

                    if (!Array.isArray(new_section_data?.layout)) {
                        new_section_data.layout = [];
                    }
                }

                update_section_redux(new_section_data);
            }
            setIsLoading(false);
        } else {
            navigate('/listing');
        }
    }

    const update_section_redux = (section_details) => {
        let updated_section = property_verify(section_details);
        dispatch(handleSectionData(updated_section));
    }

    const property_verify = (section_details) => {
        let captwiki_sections = ['content', 'layout', 'style', 'advanced']
        let dummy_section_data = { ...section_details };

        captwiki_sections?.forEach((section) => {

            if (Array.isArray(dummy_section_data?.[section]) && dummy_section_data?.[section]?.length > 0) {
                dummy_section_data?.[section]?.forEach((inner_section) => {
                    if (Array.isArray(inner_section.controllers) && inner_section.controllers?.length > 0) {
                        inner_section.controllers.forEach((controller, c_index) => {
                            inner_section.controllers[c_index] = { ...controller_array[controller.type], ...controller };
                        })
                    }

                })
            }

        })

        return dummy_section_data;
    }

    const getWidgetData = async (widget_info, prev_section) => {

        if (!widget_info.id) {
            return;
        }

        let form = new FormData();
        form.append('action', 'captwiki_dashboard_ajax_call');
        form.append('type', 'get_widget_controls_structure');
        form.append('nonce', captwiki_data.captwiki_nonce);
        form.append('widget_name', widget_info.id);

        let response = await axios.post(captwiki_data.ajax_url, form);

        if (response.data) {
            let captwiki_sections = ['content', 'layout', 'style', 'advanced']
            let widget_section = response.data;
            let new_section = {};
            var sec_array = []

            captwiki_sections.map((section) => {
                if (widget_section[section]) {

                    let widget_section_array = Object.entries(widget_section[section] ?? {})

                    if (Array.isArray(widget_section_array) && widget_section_array?.length > 0) {
                        widget_section_array?.forEach(([key, value], index, original_array) => {
                            let section_object = { name: value.label, key: key, isExternal: true }
                            let section_verify = prev_section?.[section]?.findIndex((inner_section) => inner_section.key == key);

                            if (section_verify == -1) {
                                sec_array.push(section_object)
                            }

                            if (index == original_array.length - 1) {
                                new_section[section] = [...sec_array, ...(prev_section?.[section] ?? [])]
                                sec_array = []
                            }
                        })
                    }

                }
            })

            let update_redux_section = { ...prev_section, ...new_section, ...default_redux }
            update_section_redux(update_redux_section);
        } else {
            let new_section_data = { ...prev_section, ...default_redux }
            update_section_redux(new_section_data);
        }
    }

    const widget_builder_content = () => {
        if (isLoading) {
            return (
                <div className='captwiki-widget-builder-content captwiki-widget-builder-loading'>
                    <Loader />
                </div>
            )
        } else {
            return (
                <div className='captwiki-widget-builder-content'>
                    <StickyTab />
                    <div className='captwiki-widget-builder-content-inner' ref={controlsRef}>
                        <ControllerListing />
                        <SectionLayout />
                    </div>
                    <Wb_faq />
                </div>
            )
        }
    }

    return (
        <div className='captwiki-widget-builder'>
            {widget_builder_content()}
        </div>
    )
}

export default WidgetBuilder;