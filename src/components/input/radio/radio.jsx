import React from 'react'
import './radio.scss';

const Radio = ({ checked = false, onChange, id, value }) => {
  return (
    <input className='cwk-input-radio' type='radio' value={value} checked={checked} onChange={(e) => { if (onChange) onChange(e) }} id={id || ''} />
  )
}

export default Radio
