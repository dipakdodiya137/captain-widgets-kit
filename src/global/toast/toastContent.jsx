// ToastContent.jsx
import { useEffect, useState } from 'react'

const ToastContent = ({ item, index, Remove_Notification, notificationIndex }) => {
    const [removedToast, setRemovedToast] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!removedToast) {
                Remove_toast()
            }
        }, 4000)
        return () => clearTimeout(timeout)
    }, [])

    const Remove_toast = () => {
        setRemovedToast(true)
        Remove_Notification();
    }
    
    return (
        <div className={`cwk-toast-content ${removedToast ? 'cwk-toast-content-removed' : ''} ${!(notificationIndex.includes(index)) ? 'cwk-toast-content-animation' : ''}`}>
            <div className='cwk-toast-details'>
                <span className='cwk-toast-details-title'>{item?.title}</span>
                <span className='cwk-toast-details-description'>{item?.desc}</span>
            </div>
            <span className='cwk-toast-close' onClick={Remove_toast}>X</span>
        </div>
    )
}

export default ToastContent
