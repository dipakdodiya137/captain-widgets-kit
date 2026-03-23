import React, { useEffect, useState } from 'react'
import './accordion.scss'

const Accordion = ({ header, content, open = false, delay = 500, onClick }) => {

    const [accordion_open, setAccordionOpen] = useState(open);

    const toggle_accordion = (e) => {``

        if (onClick) {
            onClick();
        }

        let accordion_content = e.target.closest('.captwiki-accordion-container');

        if (accordion_content.classList.contains('captwiki-accordion-content-show')) {
            accordion_content.classList.remove('captwiki-accordion-content-show');
            setTimeout(() => {
                setAccordionOpen(false);
            }, delay);
        } else {
            setAccordionOpen(true);
            setTimeout(() => {
                accordion_content.classList.add('captwiki-accordion-content-show');
            }, 50);
        }
    }

    return (
        <div className={`captwiki-accordion-container ${open ? 'captwiki-accordion-content-show' : ''}`}>
            <div className='captwiki-accordion-header' onClick={(e) => { toggle_accordion(e) }}>
                {header}
                <span className='captwiki-accordion-header-icon' style={{ transition: `all ${delay}ms linear` }}>
                    <i className='captwiki-i-arrow-down'></i>
                </span>
            </div>
            <div className='captwiki-accordion-content' style={{ display: accordion_open ? 'block' : 'none' }}>
                {content}
            </div>
        </div>
    )
}

export default Accordion;
