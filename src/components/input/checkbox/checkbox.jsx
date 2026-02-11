import React from 'react'
import './checkbox.scss';

const Checkbox = ({ checked = false, onChange, id, disabled = false }) => {
    return (
        <input
            className='cwk-checkbox'
            type='checkbox'
            disabled={disabled}
            checked={checked}
            onChange={(e) => { if (onChange) onChange(e) }} id={id || ''}
        />
    )
}

export default Checkbox;