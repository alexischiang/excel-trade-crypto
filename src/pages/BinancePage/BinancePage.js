import React, { useContext, useEffect, useState } from 'react'
import { Divider, Button } from 'antd'
import { onCombinedStream as _onCombinedStream } from './ws/ws'
import { fillRange, clearRange } from '../../tools/excel'
import { StatusBar, Order, PositionTable } from '../../components'
import axios from 'axios'
import { writeOptionChartHeader, writeStrikePrices } from '../../tools/writer'
import { useSnackbar } from 'notistack';
import BigNumber from "bignumber.js";
import _ from 'lodash'
import { BinanceContext } from './context'
import { IVChart } from './components'

const _axios = axios.create()


export const BinancePage = () => {
    const [wsStatus, setWsStatus] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const [positionData, setPositionData] = useState([])

    const [state, dispatch] = useContext(BinanceContext)


    const [posLoading, setPosLoading] = useState(false)

    const timeoutHandler = (pathname) => {
        enqueueSnackbar(`${pathname} 请求错误...`, {
            variant: 'error',
        })
    }

    /**
     * RestAPI获取当前价格铺入单元格
     */
    const getInfo = async () => {
        const res = await _axios.get('http://localhost:80/binance/voption/info')
        console.log(res)
    }

    /**
     * RestAPI获取当前持仓
     */
    const getCurrentPosition = () => {
        setPosLoading(true)
        _axios.get('http://localhost:80/binance/voption/currentPosition')
            .then(d => {
                if (d.data.code === 200) {
                    if (positionData.length !== 0) {
                        enqueueSnackbar('已获取最新持仓', {
                            variant: 'success'
                        })
                    }
                    setPositionData(d.data.message)
                } else {
                    enqueueSnackbar(d.data.message, {
                        variant: 'error'
                    })
                }
                setPosLoading(false)
            })
    }


    /**
     * 获取所有交割日期
     */
    const getExpiryDate = () => {
        _axios.get('http://localhost:80/binance/voption/expiryDate').then(d => {
            d.data.message.forEach((date, index) => {
                getStrikePrice(date, index)
                writeOptionChartHeader(index)
            })
            dispatch({
                type: 'UPDATE_EXPIRY_DATE',
                payload: {
                    expiryDate: d.data.message
                }
            })
        }).catch(_err => timeoutHandler('/binance/voption/expiryDate'))
    }

    /**
     * 
     * @param {number} expireyDate 
     * @param {number} chartIndex 从上往下第几张表 0,1...
     */
    const getStrikePrice = (expiryDate, chartIndex) => {
        _axios.post('http://localhost:80/binance/voption/strikePrice', { expiryDate }).then(d => {
            if (d.data.code === 200) {

                const strikePrices = d.data.message
                let streamRangePair = {}
                writeStrikePrices(expiryDate, strikePrices, chartIndex)

                strikePrices.forEach((price, i) => {
                    const cStartIndex = `D${6 + i + chartIndex * 16}`
                    const cEndIndex = `M${6 + i + chartIndex * 16}`
                    const pStartIndex = `O${6 + i + chartIndex * 16}`
                    const pEndIndex = `X${6 + i + chartIndex * 16}`

                    const singlePair = generateSymbol(expiryDate, price) //[C,P]

                    streamRangePair[`${singlePair[0]}@TICKER`] = `${cStartIndex}:${cEndIndex}`
                    streamRangePair[`${singlePair[1]}@TICKER`] = `${pStartIndex}:${pEndIndex}`


                })
                onCombinedStream(streamRangePair)
                dispatch({
                    type: 'UPDATE_STRIKE_PRICE',
                    payload: [expiryDate, strikePrices]
                })
            } else {
                timeoutHandler(`${expiryDate}行权价`)
            }
        })
    }


    const writeCombineOptionsDetail = (wsObj, streamRangePair) => {
        if (wsObj !== undefined) {
            const range = streamRangePair[wsObj.stream]
            if (_.isObject(wsObj) && ('stream' in wsObj)) {
                writeOptionsDetail(wsObj, range, !wsObj.stream.includes('P'))
            }
        }
    }

    const writeOptionsDetail = (wsObj, range, isCall) => {
        wsObj = wsObj.data ? wsObj.data : wsObj; // 兼容处理
        const _buyIV = wsObj.buyIV ? BigNumber(wsObj.buyIV).multipliedBy(100).toFixed(2) + '%' : '--'
        const _sellIV = wsObj.sellIV ? BigNumber(wsObj.sellIV).multipliedBy(100).toFixed(2) + '%' : '--'
        const data = [[wsObj.delta, wsObj.gamma, wsObj.vega, wsObj.theta, _buyIV, wsObj.ask1, wsObj.bid1, _sellIV, wsObj.currentClose, wsObj.markPrice]]
        if (isCall) {
            fillRange(range, data)
        } else {
            fillRange(range, [data[0].slice().reverse()])
        }
    }

    const onCombinedStream = (streamRangePair) => {
        const streams = Object.keys(streamRangePair)
        _onCombinedStream(streams, d => writeCombineOptionsDetail(d, streamRangePair), setWsStatus)
    }

    const generateSymbol = (date, price) => {
        return [`BTC-${date}-${price}-C`, `BTC-${date}-${price}-P`]
    }


    useEffect(() => {
        clearRange()
        getExpiryDate()
        getCurrentPosition()
        // getInfo()
        // todo: close ws
    }, [])


    const canPrintIV = (Object.keys(state.strikePrice).length === state.expiryDate.length) && (state.expiryDate.length !== 0)

    return (
        <section>
            <StatusBar wsStatus={wsStatus} />

            <Divider />

            <Order />

            <Divider />

            <Button loading={posLoading} onClick={getCurrentPosition}>刷新持仓列表</Button>

            <PositionTable dataSource={positionData} />

            {canPrintIV && <IVChart />}
        </section>
    )
}