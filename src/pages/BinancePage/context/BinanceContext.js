import React, { useReducer } from 'react'

export const BinanceContext = React.createContext(null)

const initValue = {
    expiryDate: [],
    strikePrice: {},
    tableTotal: 0,
    tableGap: 16,  // 每一张表的高度
    suffixTableGap: 3, // 第一张表距顶部的距离
}

export const BinanceProvider = ({ reducer, children }) => {
    return (
        <BinanceContext.Provider value={useReducer(reducer, initValue)}>
            {children}
        </BinanceContext.Provider>
    )
}
