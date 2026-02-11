import React from 'react';
import ReactCodeMirror, { oneDark } from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { php } from '@codemirror/lang-php';
import './code-editor.scss';

const CodeEditor = ({ lang, value, changeEvent }) => {

    const php_languages = ['php', 'php_after', 'php_before', 'php_render_content'];

    const handleExtension = () => {
        if ('html' == lang) {
            return html();
        } else if (php_languages.includes(lang)) {
            return php({
                plain: true,
            });
        } else if ('js' == lang || 'javascript' == lang) {
            return javascript();
        } else if ('css' == lang) {
            return css();
        }
    }

    return (
        <ReactCodeMirror
            extensions={[handleExtension()]}
            theme={oneDark}
            value={value}
            onChange={changeEvent}
        />
    )
}

export default CodeEditor;
