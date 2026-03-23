import React, { useEffect, useRef, useState } from 'react'
import './editor.scss'
import CodeEditor from '../../../components/code-editor/code-editor.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { handleWidgetCode } from '../../../redux/slice.jsx';
import ElementorFile from '../create-file/elementor-file.js';
import Primary_button from '../../../components/button/primary_button/primary_button.jsx';
import { Popup_structure } from '../../../global/popup/popup.jsx';
import Create_patch from '../../listing/create_patch.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Variable_panel from './variable_panel.jsx';
import { __ } from '@wordpress/i18n';

const Editor = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selected_lang, setSelectedLang] = useState([]);
    const section_data = useSelector((state) => state?.controller_section);
    const widget_code = useSelector((state) => state?.widget_code);
    const widget_info = useSelector((state) => state?.widget_info);
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const lang_array = [
        { label: 'PHP RENDER CONTENT', value: 'php' },
        { label: 'PHP BEFORE', value: 'php_before' },
        { label: 'PHP AFTER', value: 'php_after' },
        { label: 'JAVASCRIPT', value: 'js' },
        { label: 'CSS', value: 'css' }
    ];
    const added_languages = Object.keys(widget_code)?.filter((item) => item !== 'selected_lang');


    useEffect(() => {

        if (!editorRef.current) {
            return;
        }

        if (section_data?.editor_collapsed) {
            editorRef.current.classList.add('captwiki-code-editor-collapsed');
            setTimeout(() => {
                editorRef.current.style.display = 'none';
            }, 300);
        } else {
            editorRef.current.style.display = 'flex';
            setTimeout(() => {
                if (editorRef.current.classList.contains('captwiki-code-editor-collapsed')) {
                    editorRef.current.classList.remove('captwiki-code-editor-collapsed');
                }
            }, 0);
        }
    }, [section_data?.editor_collapsed])

    useEffect(() => {
        if ('add_php_lang' === showPopup?.type) {
            handlePopupData('add_php_lang')
        }
    }, [selected_lang])

    const handleCodeChange = (type, value) => {
        let updateCode = { ...widget_code, [type]: value };
        dispatch(handleWidgetCode(updateCode))
    }

    const saveWidgetChanges = async () => {
        setIsLoading(true);
        let response = await ElementorFile(section_data, widget_info, widget_code);
        setIsLoading(false);
    }

    const Delete_patch = () => {
        const [deletePatchLoader, setDeletePatchLoader] = useState(false);

        var getFoldername = location.pathname.split('/');
        var foldername = getFoldername[getFoldername.length - 1];

        const deletePatch = async () => {

            setDeletePatchLoader(true);

            let form = new FormData();
            form.append('action', 'captwiki_dashboard_ajax_call');
            form.append('nonce', captwiki_data.captwiki_nonce);
            form.append('type', 'delete_single_patch');
            form.append('folder', foldername);
            form.append('file', foldername + '.json');

            let response = await axios.post(captwiki_data.ajax_url, form);

            if (response.data.success) {
                navigate('/listing');
            }

            setTimeout(() => {
                setDeletePatchLoader(false);
            }, 3000);

        }

        return (
            <div className='captwiki-delete-patch'>
                <Primary_button text='Delete' onClick={() => { deletePatch() }} loader={deletePatchLoader} disabled={deletePatchLoader} />
            </div>
        )
    }

    const Add_language = () => {
        const handleAddLanguage = (value, type) => {
            if ('save' === type) {
                if (selected_lang.length > 0) {

                    let new_code_lang = { ...widget_code };

                    selected_lang.map((item) => {
                        if (!(widget_code[item])) {
                            new_code_lang[item] = '';
                        }
                    });

                    dispatch(handleWidgetCode(new_code_lang));
                    setShowPopup('');
                }
            } else {
                if (selected_lang.includes(value)) {
                    setSelectedLang(selected_lang.filter((item) => item !== value));
                } else {
                    setSelectedLang([...selected_lang, value]);
                }
            }
        }

        return (
            <div className='captwiki-add-language-wrapper'>
                <div className='captwiki-add-language-list'>
                    {lang_array.map((item, index) => {
                        if (!(added_languages.includes(item.value))) {
                            return (
                                <span
                                    key={index}
                                    className={`captwiki-add-language-title ${selected_lang.includes(item.value) ? 'captwiki-add-language-title-active' : ''}`}
                                    onClick={() => handleAddLanguage(item.value)}>
                                    {item.label}
                                </span>
                            )
                        }
                    })}
                </div>
                <div className='captwiki-add-language-footer'>
                    <Primary_button text='Save' onClick={() => { handleAddLanguage('', 'save') }} />
                </div>
            </div>
        )
    }

    const handlePopupData = (type) => {

        let popup_details = '';

        if ('edit_patch' === type) {
            popup_details = {
                title: __('Edit Patch', 'captain-widgets-kit'),
                desc: __('Make changes as needed and click "Save" to apply the updates.', 'captain-widgets-kit'),
                type: 'edit_patch',
                body: <Create_patch
                    btnText='Save'
                    close_popup={() => { setShowPopup('') }}
                />
            }
        } else if ('delete_patch' === type) {
            popup_details = {
                title: __('Delete Patch', 'captain-widgets-kit'),
                desc: __('Are you sure you want to delete this patch ?', 'captain-widgets-kit'),
                type: 'delete_patch',
                body: <Delete_patch />,
            }
        } else if ('add_php_lang' === type) {
            popup_details = {
                title: __('PHP Hooks', 'captain-widgets-kit'),
                desc: __('Add Elemento PHP hooks.', 'captain-widgets-kit'),
                type: 'add_php_lang',
                body: <Add_language />,
            }
        }

        setShowPopup(popup_details);
    }

    const codeTypeValidate = (type) => {

        if ('php' === type) {
            if (widget_code?.selected_lang === 'php' || widget_code?.selected_lang === 'php_render_content') {
                return true;
            }
        } else if (widget_code?.selected_lang === type) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className='captwiki-editor-panel' ref={editorRef}>
            <div className='captwiki-editor-panel-btns'>
                <div className='captwiki-editor-btn-group'>
                    {added_languages?.map((language, index) => {
                        return (
                            <div key={index} className={`captwiki-editor-lang-btn ${codeTypeValidate(language) ? 'captwiki-editor-lang-btn-active' : ''}`} onClick={() => handleCodeChange('selected_lang', language)}>
                                <span className='captwiki-editor-lang-btn-text'>{language.toUpperCase()}</span>
                            </div>
                        )
                    })}
                    {
                        lang_array?.filter((item) => !(added_languages.includes(item.value)))?.length > 0 &&
                        <div className='captwiki-editor-lang-add-wrapper'>
                            <span className='captwiki-editor-lang-add' onClick={() => handlePopupData('add_php_lang')}>
                                <i className='captwiki-i-plus'></i>
                            </span>
                        </div>
                    }
                </div>
                <Variable_panel />
                <Primary_button text='Save' loader={isLoading} onClick={() => { saveWidgetChanges() }} />
            </div>
            <CodeEditor lang={widget_code?.selected_lang} value={widget_code[widget_code?.selected_lang]} changeEvent={(value) => handleCodeChange(widget_code?.selected_lang, value)} />
            {showPopup &&
                <Popup_structure
                    title={showPopup?.title}
                    desc={showPopup?.desc}
                    body={showPopup?.body}
                    close_popup={() => { setShowPopup('') }} />
            }
        </div>
    )
}

export default Editor;
