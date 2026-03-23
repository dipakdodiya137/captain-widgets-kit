import React from 'react'
import './Input_field.scss';

const Input_field = ({ placeholder = '', value = '', changeEvent, id = '', onKeyDown = null, onFocus = null, onBlur = null, onClick = null }) => {
    return (
        <input
            className='captwiki-input-field'
            id={id}
            type='text'
            placeholder={placeholder}
            value={value}
            onClick={(e) => { if (onClick) onClick(e) }}
            onChange={(e) => { if (changeEvent) changeEvent(e) }}
            onKeyDown={(e) => { if (onKeyDown) onKeyDown(e) }}
            onFocus={(e) => { if (onFocus) onFocus(e) }}
            onBlur={(e) => { if (onBlur) onBlur(e) }}
        />
    )
}

export default Input_field;
