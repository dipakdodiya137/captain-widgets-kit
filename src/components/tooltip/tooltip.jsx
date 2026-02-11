import './tooltip.scss'
import { useEffect, useRef, useState } from 'react';

const Tooltip = ({ content, tooltipText, right = false, left = false }) => {

    const tooltipRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    const getTooltipPosition = () => {
        if (!tooltipRef.current) return;

        const containerRect = tooltipRef.current.getBoundingClientRect();
        const tooltipEl = tooltipRef.current.querySelector('.cwk-tooltip-text');
        const tooltipRect = tooltipEl.getBoundingClientRect();

        let top = containerRect.top - tooltipRect.height + 5;
        let leftPos = containerRect.left;

        if (right) {
            leftPos = containerRect.right + 8; // right side
            top = (containerRect.top + 8) + (containerRect.height / 2) - (tooltipRect.height / 2);
        } else if (left) {
            leftPos = containerRect.left - tooltipRect.width - 8; // left side
            top = (containerRect.top + 8) + (containerRect.height / 2) - (tooltipRect.height / 2);
        } else {
            // default (top-center)
            leftPos = containerRect.left + (containerRect.width / 2) - (tooltipRect.width / 2);
        }

        setTooltipPosition({ top, left: leftPos });
    };

    useEffect(() => {
        if (!tooltipRef.current) return;

        const element = tooltipRef.current;

        const observer = new ResizeObserver(() => {
            getTooltipPosition();
        });

        observer.observe(element);
        window.addEventListener("scroll", getTooltipPosition, true);
        window.addEventListener("resize", getTooltipPosition);

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", getTooltipPosition, true);
            window.removeEventListener("resize", getTooltipPosition);
        };
    }, []);

    return (
        <div
            className='cwk-tooltip-container'
            ref={tooltipRef}
            onMouseEnter={getTooltipPosition}
        >
            <span className='cwk-tooltip-content'>{content}</span>
            <span
                className='cwk-tooltip-text'
                style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
            >
                {tooltipText}
            </span>
        </div>
    );
};

export default Tooltip;
