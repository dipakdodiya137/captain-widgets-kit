import React, { useEffect, useState, Fragment, useRef } from 'react';
import axios from 'axios';
import './Home.scss';
import PatchCard from '../../global/patch-card/patch-card.jsx';
import NotFound from '../../global/not-found/not-found.jsx';
import SkeletonPatchCard from '../../global/patch-card/skeleton-patch-card.jsx';
import { getArray } from '../../global/elements';
import Accordion from '../../global/accordion/accordion.jsx';
import Checkbox from '../../components/input/checkbox/checkbox.jsx';
import { useSelector } from 'react-redux';
import Radio from '../../components/input/radio/radio.jsx';
import Primary_button from '../../components/button/primary_button/primary_button.jsx';
import Filter_search from '../../global/filter_search/filter_search.jsx';
import Filter_panel from '../../global/filter_panel/filter_panel.jsx';
import { __ } from '@wordpress/i18n';

const Home = (props) => {

    const [patchData, setPatchData] = useState([])
    const [patchList, setPatchList] = useState([])
    const [filterCollapse, setFilterCollapse] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const filterArgsRef = useRef({
        plugins: [],
        type: '',
        search: '',
        alphabet: ''
    });
    const plugin_info = useSelector((state) => state.plugin_info);

    useEffect(() => {
        fetchData();
    }, []);

    const url_filter = (data) => {
        return Object.fromEntries(Object.entries(data).filter(([key, value]) => value != 1 && value != false && value !== "[]" && value !== "all"));
    }

    const fetchData = async () => {

        setLoading(true);
        let form = new FormData();
        form.append('action', 'cwk_dashboard_ajax_call');
        form.append('type', 'get_browse_list');
        form.append('nonce', cwk_data.cwk_nonce);

        let response = await axios.post(cwk_data.ajax_url, form);

        if (response.data.success) {
            setPatchData(response.data.data);
            setPatchList(response.data.data);
        }
        setLoading(false);
    }

    const handleFilter = () => {

        let newPatchList = [...patchData];

        setLoading(true);

        if (searchValue?.trim()) {
            newPatchList = newPatchList.filter((patch) => {
                return patch?.data?.widget_info?.name
                    ?.toLowerCase()
                    ?.includes(searchValue?.toLowerCase());
            });
        }

        if (Array.isArray(filterArgsRef?.current?.plugins) && filterArgsRef?.current?.plugins?.length > 0) {
            newPatchList = newPatchList.filter((patch) => {
                return filterArgsRef?.current?.plugins?.includes(patch?.data?.widget_info?.selected_plugin?.plugin_name);
            });
        }

        if (filterArgsRef?.current?.type?.trim()) {
            newPatchList = newPatchList.filter((patch) => {
                return patch?.data?.widget_info?.effect_type === filterArgsRef?.current?.type;
            });
        }

        if (filterArgsRef?.current?.alphabet?.trim()) {
            newPatchList = newPatchList.filter((patch) => {
                return patch?.data?.widget_info?.name?.charAt(0)?.toLowerCase() === filterArgsRef?.current?.alphabet?.toLowerCase();
            });
        }

        setPatchList(newPatchList);

        setTimeout(() => {
            setLoading(false);
        }, 700);
    }

    const updateFilter = (type, value, updateData = true) => {

        let updatedArgs = { ...filterArgsRef?.current };

        if (Array.isArray(updatedArgs[type])) {
            if (updatedArgs[type]?.includes(value)) {
                updatedArgs[type] = updatedArgs[type].filter((item) => item !== value);
            } else {
                updatedArgs[type].push(value);
            }
        } else {
            updatedArgs[type] = value;
        }

        filterArgsRef.current = updatedArgs;

        if (updateData) {
            handleFilter(type);
        }
    }

    const listContent = () => {

        let extensionListClass = 'cwk-patch-list';

        if (filterCollapse) {
            extensionListClass = 'cwk-patch-list cwk-patch-list-collapse';
        }

        if (loading) {
            return (
                <div className={extensionListClass}>
                    {getArray(10).map((nnn, index) => {
                        return (
                            <Fragment key={index}>
                                <SkeletonPatchCard />
                            </Fragment>
                        )
                    })}
                </div>
            )
        } else if (patchList.length > 0) {
            return (
                <div className={extensionListClass}>
                    {patchList.map((data, index) => {
                        return (
                            <Fragment key={index}>
                                <PatchCard
                                    widget_info={data?.data?.widget_info}
                                    section={data?.data?.section}
                                    widget_code={data?.data?.widget_code}
                                    folder={data?.folder}
                                    file={data?.file}
                                    fetchData={fetchData}
                                    type='browse_page'
                                />
                            </Fragment>
                        )
                    })
                    }
                </div>
            )
        } else {
            return (
                <NotFound text={__('No Extensions Found', 'captain-widgets-kit')} description={__('You haven\'t added any extensions yet. Create new or explore available extensions.', 'captain-widgets-kit')} />
            )
        }

    }

    const headerPanel = () => {
        return (
            <div className='cwk-header-panel'>
                <div className='cwk-header-filter-handler' onClick={() => setFilterCollapse(!filterCollapse)}>
                    <span className='cwk-header-filter-icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="20" height="20" aria-hidden="true">
                            <path d="M15.8,2H6.9C6.7,0.7,5.4-0.2,4,0.1C3,0.3,2.2,1,2,2H0.2C0.1,2,0,2.1,0,2.3v0.5 C0,2.9,0.1,3,0.2,3H2C2.3,4.4,3.6,5.2,5,5c1-0.2,1.8-1,1.9-2h8.8C15.9,3,16,2.9,16,2.8V2.3C16,2.1,15.9,2,15.8,2z M4.5,4C3.7,4,3,3.3,3,2.5S3.7,1,4.5,1S6,1.7,6,2.5S5.3,4,4.5,4z"></path>
                            <path d="M15.8,12H8.9C8.7,10.7,7.4,9.8,6,10.1c-1,0.2-1.8,1-1.9,1.9H0.2C0.1,12,0,12.1,0,12.3v0.5 C0,12.9,0.1,13,0.2,13h3.8C4.3,14.4,5.6,15.2,7,15c1-0.2,1.8-1,1.9-1.9h6.8c0.1,0,0.2-0.1,0.2-0.2v-0.5C16,12.1,15.9,12,15.8,12z M6.5,14C5.7,14,5,13.3,5,12.5S5.7,11,6.5,11S8,11.7,8,12.5S7.3,14,6.5,14z"></path>
                            <path d="M0,7.3v0.5C0,7.9,0.1,8,0.2,8h8.8c0.3,1.4,1.6,2.2,2.9,1.9c1-0.2,1.8-1,1.9-1.9h1.8 C15.9,8,16,7.9,16,7.8V7.3C16,7.1,15.9,7,15.8,7h-1.8c-0.3-1.3-1.6-2.2-2.9-1.9C10,5.3,9.2,6,9.1,7H0.2C0.1,7,0,7.1,0,7.3z M10,7.5 C10,6.7,10.7,6,11.5,6S13,6.7,13,7.5S12.3,9,11.5,9S10,8.3,10,7.5z"></path>
                        </svg>
                    </span>
                    <span className='cwk-header-filter-label'>{__('Filters', 'captain-widgets-kit')}</span>
                </div>
                <Filter_search
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    updateFilter={() => { updateFilter('search', searchValue) }}
                />
            </div>
        )
    }

    const filterContent = () => {


        const alphabets =
            [
                { label: __('A', 'captain-widgets-kit'), value: 'A' },
                { label: __('B', 'captain-widgets-kit'), value: 'B' },
                { label: __('C', 'captain-widgets-kit'), value: 'C' },
                { label: __('D', 'captain-widgets-kit'), value: 'D' },
                { label: __('E', 'captain-widgets-kit'), value: 'E' },
                { label: __('F', 'captain-widgets-kit'), value: 'F' },
                { label: __('G', 'captain-widgets-kit'), value: 'G' },
                { label: __('H', 'captain-widgets-kit'), value: 'H' },
                { label: __('I', 'captain-widgets-kit'), value: 'I' },
                { label: __('J', 'captain-widgets-kit'), value: 'J' },
                { label: __('K', 'captain-widgets-kit'), value: 'K' },
                { label: __('L', 'captain-widgets-kit'), value: 'L' },
                { label: __('M', 'captain-widgets-kit'), value: 'M' },
                { label: __('N', 'captain-widgets-kit'), value: 'N' },
                { label: __('O', 'captain-widgets-kit'), value: 'O' },
                { label: __('P', 'captain-widgets-kit'), value: 'P' },
                { label: __('Q', 'captain-widgets-kit'), value: 'Q' },
                { label: __('R', 'captain-widgets-kit'), value: 'R' },
                { label: __('S', 'captain-widgets-kit'), value: 'S' },
                { label: __('T', 'captain-widgets-kit'), value: 'T' },
                { label: __('U', 'captain-widgets-kit'), value: 'U' },
                { label: __('V', 'captain-widgets-kit'), value: 'V' },
                { label: __('W', 'captain-widgets-kit'), value: 'W' },
                { label: __('X', 'captain-widgets-kit'), value: 'X' },
                { label: __('Y', 'captain-widgets-kit'), value: 'Y' },
                { label: __('Z', 'captain-widgets-kit'), value: 'Z' }

            ];

        const pluginAcoordion = (type) => {
            if ('header' === type) {
                return (
                    <div className='cwk-accordion-header'>
                        <span className='cwk-accordion-header-label'>{__('Plugins', 'captain-widgets-kit')}</span>
                    </div>
                )
            } else if ('content' === type) {

                let plugin_lest = plugin_info ? Object.keys(plugin_info) : [];

                // if (plugin_lest?.length > 0) {
                //     return (
                //         <div className='cwk-accordion-content'>
                //             {plugin_lest?.map((plugin, index) => {
                //                 return (
                //                     <label className='cwk-accordion-content-label' key={index}>
                //                         <span className='cwk-accordion-content-text'>{plugin}</span>
                //                         <Checkbox value={plugin} checked={filterArgsRef?.current?.plugins?.includes(plugin)} onChange={(e) => updateFilter('plugins', plugin)} />
                //                     </label>
                //                 )
                //             })}
                //         </div>
                //     )
                // } else {
                return (
                    <div className='cwk-accordion-content'>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Elementor', 'captain-widgets-kit')}</span>
                            <Checkbox value='Elementor' checked={filterArgsRef?.current?.plugins?.includes('Elementor')} onChange={(e) => updateFilter('plugins', 'Elementor')} />
                        </label>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Essential Addons for Elementor', 'captain-widgets-kit')}</span>
                            <Checkbox value='Essential Addons for Elementor' checked={filterArgsRef?.current?.plugins?.includes('Essential Addons for Elementor')} onChange={(e) => updateFilter('plugins', 'Essential Addons for Elementor')} />
                        </label>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Happy Elementor Addons', 'captain-widgets-kit')}</span>
                            <Checkbox value='Happy Elementor Addons' checked={filterArgsRef?.current?.plugins?.includes('Happy Elementor Addons')} onChange={(e) => updateFilter('plugins', 'Happy Elementor Addons')} />
                        </label>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Royal Elementor Addons', 'captain-widgets-kit')}</span>
                            <Checkbox value='Royal Elementor Addons' checked={filterArgsRef?.current?.plugins?.includes('Royal Elementor Addons')} onChange={(e) => updateFilter('plugins', 'Royal Elementor Addons')} />
                        </label>
                    </div>
                )
                // }
            }
        }

        const typeAcoordion = (type) => {
            if ('header' === type) {
                return (
                    <div className='cwk-accordion-header'>
                        <span className='cwk-accordion-header-label'>{__('Type', 'captain-widgets-kit')}</span>
                    </div>
                )
            } else if ('content' === type) {
                return (
                    <div className='cwk-accordion-content'>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Widget', 'captain-widgets-kit')}</span>
                            <Radio value='widget' checked={filterArgsRef?.current?.type === 'widget'} onChange={(e) => updateFilter('type', e.target?.value)} />
                        </label>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Container', 'captain-widgets-kit')}</span>
                            <Radio value='container' checked={filterArgsRef?.current?.type === 'container'} onChange={(e) => updateFilter('type', e.target?.value)} />
                        </label>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Section', 'captain-widgets-kit')}</span>
                            <Radio value='section' checked={filterArgsRef?.current?.type === 'section'} onChange={(e) => updateFilter('type', e.target?.value)} />
                        </label>
                        <label className='cwk-accordion-content-label'>
                            <span className='cwk-accordion-content-text'>{__('Column', 'captain-widgets-kit')}</span>
                            <Radio value='column' checked={filterArgsRef?.current?.type === 'column'} onChange={(e) => updateFilter('type', e.target?.value)} />
                        </label>
                    </div>
                )
            }
        }

        const resetFilters = () => {
            filterArgsRef.current = {
                plugins: [],
                type: '',
                search: '',
                alphabet: ''
            };
            setSearchValue('');
            handleFilter();
        }

        const alphabetAcoordion = (type) => {

            if ('header' === type) {
                return (
                    <div className='cwk-accordion-header'>
                        <span className='cwk-accordion-header-label'>{__('Alphabets', 'captain-widgets-kit')}</span>
                    </div>
                )
            } else if ('content' === type) {
                return (
                    <div className='cwk-accordion-alpabet-content'>
                        {alphabets.map((alphabet, index) => {
                            return (
                                <label className='cwk-accordion-content-label' htmlFor={`cwk-alphabet-${alphabet?.value}`} key={index}>
                                    <input type="radio"
                                        id={`cwk-alphabet-${alphabet?.value}`}
                                        value={alphabet?.value}
                                        checked={filterArgsRef?.current?.alphabet?.includes(alphabet?.value)}
                                        onChange={(e) => updateFilter('alphabet', alphabet?.value)}
                                        style={{ display: 'none' }}
                                    />
                                    <span className={`cwk-accordion-content-text ${filterArgsRef?.current?.alphabet?.includes(alphabet?.value) ? 'cwk-accordion-content-text-active' : ''}`}>{alphabet?.label}</span>
                                </label>
                            )
                        })}
                    </div>
                )
            }
        }

        return (
            <div className='cwk-filter-content'>
                <hr className='cwk-filter-panel-divider' />
                <Accordion
                    header={pluginAcoordion('header')}
                    content={pluginAcoordion('content')}
                    open={true}
                />
                <hr className='cwk-filter-panel-divider' />
                <Accordion
                    header={typeAcoordion('header')}
                    content={typeAcoordion('content')}
                    open={true}
                />
                <hr className='cwk-filter-panel-divider' />
                <Accordion
                    header={alphabetAcoordion('header')}
                    content={alphabetAcoordion('content')}
                    open={true}
                />
                <hr className='cwk-filter-panel-divider' />
                {(Array.isArray(Object.values(url_filter(filterArgsRef?.current))) && Object.values(url_filter(filterArgsRef?.current)).length > 0) && (
                    <Primary_button
                        text={(<>{__('Reset Filters', 'captain-widgets-kit')}<i className='cwk-i-close'></i></>)}
                        onClick={() => resetFilters()}
                    />
                )}
            </div>
        )
    }

    return (
        <div className="cwk-browse-page">
            {headerPanel()}
            <div className='cwk-page-content'>
                <Filter_panel collapse={filterCollapse} filterContent={filterContent()} />
                {listContent()}
            </div>
        </div>
    );
};

export default Home;
