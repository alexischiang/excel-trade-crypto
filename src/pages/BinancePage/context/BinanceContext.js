import React, { useContext, useReducer } from 'react'

const BinanceContext = React.createContext(null)

const initValue = {
    expireDate: [],
    strikePrice: {}
}

export const BinanceProvider = ({ reducer, children }) => {
    return (
        <BinanceContext.Provider value={useReducer(reducer, initValue)}>
            {children}
        </BinanceContext.Provider>
    )
}

export const useBinanceContext = useContext(BinanceContext)