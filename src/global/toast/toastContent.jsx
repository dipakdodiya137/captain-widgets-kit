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
        <div className={`captwiki-toast-content ${removedToast ? 'captwiki-toast-content-removed' : ''} ${!(notificationIndex.includes(index)) ? 'captwiki-toast-content-animation' : ''}`}>
            <div className='captwiki-toast-details'>
                <span className='captwiki-toast-details-title'>{item?.title}</span>
                <span className='captwiki-toast-details-description'>{item?.desc}</span>
            </div>
            <span className='captwiki-toast-close' onClick={Remove_toast}>X</span>
        </div>
    )
}

export default ToastContent
