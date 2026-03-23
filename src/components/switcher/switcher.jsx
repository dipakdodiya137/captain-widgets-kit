import React from 'react'
import './switcher.scss'

const Switcher = ({ checked, onChange }) => {
  return (
    <label className='captwiki-switcher'>
      <input type='checkbox' className='captwiki-switcher-input' checked={checked} onChange={onChange}/>
      <span className='captwiki-switcher-slider'></span>
    </label>    
  )
}

export default Switcher
