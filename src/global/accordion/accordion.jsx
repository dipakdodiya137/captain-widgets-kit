import React, { useEffect, useState } from 'react'
import './accordion.scss'

const Accordion = ({ header, content, open = false, delay = 500, onClick }) => {

    const [accordion_open, setAccordionOpen] = useState(open);

    const toggle_accordion = (e) => {``

        if (onClick) {
            onClick();
        }

        let accordion_content = e.target.closest('.cwk-accordion-container');

        if (accordion_content.classList.contains('cwk-accordion-content-show')) {
            accordion_content.classList.remove('cwk-accordion-content-show');
            setTimeout(() => {
                setAccordionOpen(false);
            }, delay);
        } else {
            setAccordionOpen(true);
            setTimeout(() => {
                accordion_content.classList.add('cwk-accordion-content-show');
            }, 50);
        }
    }

    return (
        <div className={`cwk-accordion-container ${open ? 'cwk-accordion-content-show' : ''}`}>
            <div className='cwk-accordion-header' onClick={(e) => { toggle_accordion(e) }}>
                {header}
                <span className='cwk-accordion-header-icon' style={{ transition: `all ${delay}ms linear` }}>
                    <i className='cwk-i-arrow-down'></i>
                </span>
            </div>
            <div className='cwk-accordion-content' style={{ display: accordion_open ? 'block' : 'none' }}>
                {content}
            </div>
        </div>
    )
}

export default Accordion;
