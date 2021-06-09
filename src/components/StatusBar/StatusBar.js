import React, { useEffect, useState } from 'react'

import './StatusBar.css'

import { ExclamationCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

export const StatusBar = (props) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(!props.wsStatus)
    }, [props.wsStatus])

    return <div className={'status-bar'}>
        {
            loading
                ? <div className={'loading'}>
                    <ExclamationCircleTwoTone twoToneColor="#eb2f96" style={{ fontSize: '12px' }} />
                    <span className={'status-text'}>WAITING CONNECTIONS...</span>
                </div>
                : <div className={'unloading'}>
                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '12px' }} />
                    <span className={'status-text'}>WEBSOCKET CONNECTED!</span>
                </div>
        }
    </div>
}