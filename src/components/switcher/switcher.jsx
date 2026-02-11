import React from 'react'
import './switcher.scss'

const Switcher = ({ checked, onChange }) => {
  return (
    <label className='cwk-switcher'>
      <input type='checkbox' className='cwk-switcher-input' checked={checked} onChange={onChange}/>
      <span className='cwk-switcher-slider'></span>
    </label>    
  )
}

export default Switcher
