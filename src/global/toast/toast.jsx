import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './toast.scss'
import ToastContent from './toastContent.jsx'
import { handleToastMessage } from '../../redux/slice.jsx'

const Toast = () => {

    const [notificationData, setNotificationData] = useState([])
    const [notificationIndex, setNotificationIndex] = useState([])
    const toast_message = useSelector((state) => state?.toast_message);
    const dispatch = useDispatch();

    useEffect(() => {
        if (toast_message) {
            // setNotificationData(prev => [...prev, toast_message])
            setNotificationData([toast_message])
            dispatch(handleToastMessage(''))
        }

        if (notificationData.length === 0) {
            setNotificationIndex([])
        }
    }, [toast_message])


    const Remove_Notification = (index) => {
        const updatedList = notificationData.filter((_, i) => i !== index)

        setTimeout(() => {
            setNotificationData(updatedList)
        }, 400)
    }


    const Add_Notification_Index = (index) => {
        if (!notificationIndex.includes(index) && notificationData.length > 0) {
            setTimeout(() => {
                let newIndex = [...notificationIndex, index]
                setNotificationIndex(newIndex)
            }, 500);
        }
    }

    if (Array.isArray(notificationData) && notificationData.length > 0) {
        return (
            <div className="cwk-toast-container"
            style={{ position: 'fixed', top: '50px' }}
            >
                {notificationData.map((item, index) => {
                    if (index < notificationData.length - 1) {
                        return null
                    } else if (item?.title != '') {
                        Add_Notification_Index(index)
                        return (
                            <Fragment key={`${item?.title || index}-${index}`}>
                                <ToastContent
                                    item={item}
                                    index={index}
                                    Remove_Notification={() => Remove_Notification(index)}
                                    notificationIndex={notificationIndex}
                                />
                            </Fragment>
                        )
                    }
                })}
            </div>
        )
    }

    return null
}

export default Toast
