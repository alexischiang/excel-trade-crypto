import React, { useContext } from 'react'
import { BinanceContext } from '../../context'
import { Button } from 'antd'
import _ from 'lodash'
import { fillRange, arrToCol } from '../../../../tools/excel'

export const IVChart = () => {
    const [state] = useContext(BinanceContext)
    const { expiryDate, strikePrice, suffixTableGap, tableTotal, tableGap } = state

    const calCopyRange = (date, price, side, symbol) => {
        let xAxis
        if (symbol === 'C') {
            xAxis = side === 'BUY' ? 'H' : 'K'
        } else {
            xAxis = side === 'BUY' ? 'T' : 'Q'
        }
        const dateIndex = expiryDate.indexOf(date)
        const priceIndex = strikePrice[date].indexOf(price)
        if (dateIndex == -1 || priceIndex == -1) return ''

        const yAxis = (dateIndex * 16) + suffixTableGap + 2 + (priceIndex + 1)
        return xAxis + yAxis
    }

    const generateArray = () => {
        const { strikePrice, expiryDate } = state

        // 拼接所有价格
        let allPrices = []
        Object.keys(strikePrice).forEach(date => {
            allPrices = allPrices.concat(strikePrice[date])
        })
        allPrices = _.uniq(allPrices.map(i => +i)).sort((a, b) => a - b)

        return [allPrices, expiryDate]
    }

    const printIV = () => {
        const [yAxis, xAxis] = generateArray()
        const startIndex = tableTotal * tableGap + suffixTableGap + 2
        fillRange(`D${startIndex + 1}:D${startIndex + (yAxis.length - 1) + 1}`, arrToCol(yAxis), { background: '#ffe28e', bold: true })
        const _xAxis = ['C-BUY', ...xAxis, 'C-SELL', ...xAxis, 'P-BUY', ...xAxis, 'P-SELL', ...xAxis,]
        fillRange(`${window.excelRow[3]}${startIndex}:${window.excelRow[3 + _xAxis.length - 1]}${startIndex}`, [_xAxis], { background: '#4472c4', color: 'white' })

        let leftTopY = 'E'
        let leftTopX = startIndex + 1
        yAxis.forEach((price) => {
            _xAxis.forEach((date, xI) => {
                const arr = ['C-BUY', 'C-SELL', 'P-BUY', 'P-SELL']
                if (arr.includes(date)) return
                leftTopY = window.excelRow[3 + xI]
                console.log(xI)
                const currentChart = arr[xI % (xAxis.length + 1)].split('-')
                const copyRange = calCopyRange(date, `${price}`, currentChart[1], currentChart[0])
                fillRange(`${leftTopY}${leftTopX}`, copyRange == '' ? '' : '=' + copyRange)
            })
            leftTopX += 1
        })
    }


    return <Button onClick={printIV} >
        打印隐含波动率
    </Button>

}