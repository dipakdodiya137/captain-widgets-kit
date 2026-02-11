import React from 'react'
import './filter_search.scss'
import Input_field from '../../components/input/input_field/Input_field.jsx'
import { __ } from '@wordpress/i18n';

const filter_search = ({ searchValue, setSearchValue, updateFilter }) => {
    return (
        <div className='cwk-filter-search-container'>
            <span className='cwk-filter-search-icon'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.5 20.5" width="20" height="20" aria-hidden="true">
                    <path d="M9.7 17c-.9 0-1.9-.2-2.8-.5-1.8-.7-3.3-2.1-4-3.9-1.6-3.7.2-8.1 3.9-9.7 1.8-.8 3.8-.8 5.6 0 1.8.7 3.2 2.1 4 3.9.8 1.8.8 3.8 0 5.6-.7 1.8-2.1 3.2-3.9 4-.9.4-1.9.6-2.9.6ZM7.2 3.9c-3.2 1.3-4.6 5-3.3 8.2.7 1.5 1.9 2.7 3.4 3.3 1.5.6 3.2.6 4.8 0 1.5-.7 2.7-1.9 3.3-3.4.6-1.5.6-3.2 0-4.8S13.5 4.5 12 3.9c-1.5-.6-3.2-.6-4.8 0Z"></path>
                    <path d="M19.7 20.3c-.1 0-.3 0-.4-.2L14 14.8c-.2-.2-.2-.6 0-.8.2-.2.6-.2.8 0l5.3 5.3c.2.2.2.6 0 .8-.1.1-.3.2-.4.2Z"></path>
                </svg>
            </span>
            <Input_field
                placeholder={__('Search', 'captain-widgets-kit')}
                id='cwk-search-patch'
                value={searchValue}
                changeEvent={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && updateFilter) updateFilter() }}
            />
        </div>
    )
}

export default filter_search
