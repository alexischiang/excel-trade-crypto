import { fillRange, arrToCol, paintRange, boldRange } from './excel'
import _ from 'lodash'

const optionChartHeader = ['Delta', 'Gamma', 'Vega', 'Theta', '隐含波动率', '买一价', '卖一价', '隐含波动率', '最新价', '标价']

const writeHeader = (chartIndex) => {
    const startRangeIndex = 5 + chartIndex * 16

    const beginRange = window.excelRow[window.excelRow.indexOf('N') - 10]
    const endRange = window.excelRow[window.excelRow.indexOf('N') - 1]
    const range = `${beginRange}${startRangeIndex}:${endRange}${startRangeIndex}`
    paintRange(range, "#4472C4", "white")

    const reverseBeginRange = window.excelRow[window.excelRow.indexOf('N') + 1]
    const reverseEndRange = window.excelRow[window.excelRow.indexOf('N') + 10]
    const reverseRange = `${reverseBeginRange}${startRangeIndex}:${reverseEndRange}${startRangeIndex}`
    paintRange(reverseRange, "#4472C4", "white")

    fillRange(range, [optionChartHeader])
    fillRange(reverseRange, [optionChartHeader.slice().reverse()])
}

const writeSubheader = (chartIndex) => {
    const startRangeIndex = 4 + chartIndex * 16
    const callRange = `${window.excelRow[window.excelRow.indexOf('N') - 10]}${startRangeIndex}`
    const putRange = `${window.excelRow[window.excelRow.indexOf('N') + 10]}${startRangeIndex}`

    fillRange(callRange, '看涨期权')
    paintRange(callRange, '#65a33e', 'white')
    fillRange(putRange, '看跌期权')
    paintRange(putRange, '#ff0001', 'white')

}

/**
 * 
 * @param {string} expiryDate 当前行权日
 * @param {array} data 当前行权日下的
 */
export const writeStrikePrices = (expiryDate, data, chartIndex) => {
    const len = data.length
    if (_.isArray(data)) {
        data = arrToCol(data)
    }
    const startRangeIndex = 4 + chartIndex * 16
    fillRange(`N${startRangeIndex}`, expiryDate)
    boldRange(`N${startRangeIndex}`)

    fillRange(`N${startRangeIndex + 1}`, '行权价')
    fillRange(`N${startRangeIndex + 2}:N${startRangeIndex + 1 + len}`, data)
    paintRange(`N${startRangeIndex + 1}:N${startRangeIndex + 1 + len}`, '#ffe28e')
    boldRange(`N${startRangeIndex + 1}:N${startRangeIndex + 1 + len}`)
}

export const writeOptionChartHeader = (chartIndex) => {
    writeHeader(chartIndex)
    writeSubheader(chartIndex)
}

