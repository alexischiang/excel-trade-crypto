import React from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { Statistic, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { fillRange } from '../../excel'
import _ from 'lodash'


export const IndexPrice = () => {
    const [currentPrice, setCurrentPrice] = useState(0)
    const [percent, setPercent] = useState(0)

    const setupWebsocket = () => {

        const ws = new ReconnectingWebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker')

        ws.onmessage = (message) => {
            const parsed = JSON.parse(message.data)
            fillRange('D2:E2', [['BTC标记价格', (+parsed.c).toFixed(2)]])

            setCurrentPrice(parsed.c)
            setPercent(parsed.P)
        }
    }

    useEffect(() => {
        setupWebsocket()
    }, [])

    return <Row>
        <Col span={12}>
            <Statistic
                title='BTC标记价格'
                precision={2}
                value={currentPrice}
                valueStyle={{ fontSize: '12px' }}
            />
        </Col>
        <Col offset={2} span={10}>
            <Statistic
                title='24H涨跌幅'
                value={percent}
                precision={2}
                valueStyle={{ color: percent > 0 ? '#3AC181' : '#F74A4C', fontSize: '12px' }}
                suffix="%"
            />
        </Col>
    </Row>
}