import React from 'react'
import './primary_button.scss';
import Loader from '../../loader/loader.jsx';

const Primary_button = ({ text = '', loader = false, onClick, disabled = false }) => {

    return (
        <button className='captwiki-primary-button' onClick={() => { if (onClick) onClick() }} disabled={disabled || loader}>
            {text}
            {loader &&
                <Loader />
            }
        </button>
    );
};

export default Primary_button;