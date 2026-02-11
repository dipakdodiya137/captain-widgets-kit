import React from 'react'
import './patch-card.scss';

const SkeletonPatchCard = () => {
    return (
        <div className='cwk-patch-card-container cwk-patch-card-skeleton'>
            <div className='cwk-patch-card'>
                <div className='cwk-patch-card-header'>
                    <span className='cwk-patch-card-title'>Cwk Patch Name</span>
                    <span className='cwk-patch-card-header-description'>Cwk Patch Description</span>
                </div>
                <div className='cwk-patch-card-footer'>
                    <div className='cwk-patch-card-effect-type-wrapper'>
                        <span className='cwk-patch-card-effect-type'>
                            Widget
                        </span>
                    </div>
                    <div className='cwk-patch-card-footer-actions'>
                        <span className='cwk-patch-card-footer-button'>Edit</span>
                        <span className='cwk-patch-card-footer-button'>Delete</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonPatchCard
