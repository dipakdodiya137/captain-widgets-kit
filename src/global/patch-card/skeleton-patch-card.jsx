import React from 'react'
import './patch-card.scss';

const SkeletonPatchCard = () => {
    return (
        <div className='captwiki-patch-card-container captwiki-patch-card-skeleton'>
            <div className='captwiki-patch-card'>
                <div className='captwiki-patch-card-header'>
                    <span className='captwiki-patch-card-title'>Captwiki Patch Name</span>
                    <span className='captwiki-patch-card-header-description'>Captwiki Patch Description</span>
                </div>
                <div className='captwiki-patch-card-footer'>
                    <div className='captwiki-patch-card-effect-type-wrapper'>
                        <span className='captwiki-patch-card-effect-type'>
                            Widget
                        </span>
                    </div>
                    <div className='captwiki-patch-card-footer-actions'>
                        <span className='captwiki-patch-card-footer-button'>Edit</span>
                        <span className='captwiki-patch-card-footer-button'>Delete</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonPatchCard
