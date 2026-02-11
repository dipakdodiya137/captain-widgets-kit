import React, { useEffect, useState } from 'react'
import './sticky-tab.scss';
import { useSelector, useDispatch } from 'react-redux';
import { handleSectionData } from '../../../redux/slice.jsx';
import { __ } from '@wordpress/i18n';
import Edit_extension from './edit_extension/edit-extension.jsx';
import { Popup_structure } from '../../../global/popup/popup.jsx';

const StickyTab = () => {

    const [tabPosition, setTabPosition] = useState({ bottom: 30, left: 'calc(50% + 32px)' })
    const [isDragging, setIsDragging] = useState(false);
    const [showPopup, setShowPopup] = useState('');
    const section_data = useSelector((state) => state?.controller_section);
    const widget_info = useSelector((state) => state?.widget_info);
    const dispatch = useDispatch();

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleCollapse = (type) => {
        let redux_section_data = { ...section_data }

        let collapse_check = true;
        let builder_panels = ['controller_collapsed', 'section_collapsed', 'editor_collapsed'];

        builder_panels.forEach(panel => {
            if (!(redux_section_data?.[panel]) && panel !== type) {
                collapse_check = false;
            }
        });

        if (collapse_check) {
            return;
        }

        if (redux_section_data?.[type]) {
            redux_section_data[type] = false;
        } else {
            redux_section_data[type] = true;
        }

        dispatch(handleSectionData(redux_section_data));
    }

    const getClassName = (type) => {

        let redux_section_data = { ...section_data }
        let collapse_check = true;
        let builder_panels = ['controller_collapsed', 'section_collapsed', 'editor_collapsed'];

        builder_panels.forEach(panel => {
            if (!(redux_section_data?.[panel]) && panel !== type) {
                collapse_check = false;
            }
        });

        if (!section_data?.[type]) {
            if (collapse_check) {
                return 'cwk-sticky-tab-title cwk-sticky-tab-title-active cwk-sticky-tab-title-disabled';
            } else {
                return 'cwk-sticky-tab-title cwk-sticky-tab-title-active';
            }
        } else {
            return 'cwk-sticky-tab-title';
        }

    }

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        setTabPosition({
            bottom: window.innerHeight - (e.clientY + 12),
            left: e.clientX + 180
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handlePopup = (type) => {
        let popup_data = '';

        if ('edit' == type) {
            popup_data = {
                title: __(`Edit Settings`, 'captain-widgets-kit'),
                type: 'edit',
                body: <Edit_extension close_popup={() => { setShowPopup('') }} />,
            }
        }

        setShowPopup(popup_data);
    }

    return (
        <>
            <div className='cwk-sticky-tab' style={{ bottom: tabPosition.bottom, left: tabPosition.left }}>
                <span className='cwk-sticky-tab-icon' onMouseDown={(e) => { handleMouseDown(e) }}>
                    <i className='cwk-i-drag'></i>
                </span>
                <span className={getClassName('controller_collapsed')} onClick={() => handleCollapse('controller_collapsed')}>{__('Controllers', 'captain-widgets-kit')}</span>
                <span className={getClassName('section_collapsed')} onClick={() => handleCollapse('section_collapsed')}>{__('Layout', 'captain-widgets-kit')}</span>
                <span className={getClassName('editor_collapsed')} onClick={() => handleCollapse('editor_collapsed')}>{__('Editor', 'captain-widgets-kit')}</span>
                <hr className='cwk-sticky-tab-divider' />
                <span className='cwk-sticky-tab-action' onClick={() => handlePopup('edit')}>
                    <i className='cwk-i-edit'></i>
                </span>
            </div>
            {showPopup &&
                <Popup_structure
                    title={showPopup?.title}
                    desc={showPopup?.desc}
                    body={showPopup?.body}
                    close_popup={() => { setShowPopup('') }}
                />
            }
        </>
    )
}

export default StickyTab
