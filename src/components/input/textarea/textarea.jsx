import React, { forwardRef } from 'react'
import './textarea.scss';

const Textarea = forwardRef(({
    placeholder = '',
    defaultValue = '',
    value = '',
    onChange = () => { },
    id = '',
    onKeyDown = () => { },
    onFocus = () => { },
    onBlur = () => { },
    onClick = () => { },
    rows = 1,
    uncontrolled = false
}, ref) => {

    if (uncontrolled) {
        return (
            <textarea
                className="captwiki-textarea"
                id={id}
                placeholder={placeholder}
                ref={ref}
                onKeyDown={onKeyDown}
                defaultValue={defaultValue}
                onFocus={onFocus}
                onBlur={onBlur}
                onClick={onClick}
                rows={rows}
            />
        )
    }

    return (
        <textarea
            className="captwiki-textarea"
            id={id}
            placeholder={placeholder}
            ref={ref}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={onClick}
            rows={rows}
        />
    )
})

export default Textarea;
