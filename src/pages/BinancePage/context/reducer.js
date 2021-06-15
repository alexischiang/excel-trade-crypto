export const reducer = (state, action) => {
    const { payload } = action
    switch (action.type) {
        case 'UPDATE_EXPIRY_DATE':
            return { ...state, expiryDate: payload.expiryDate, tableTotal: payload.expiryDate.length }
        case 'UPDATE_STRIKE_PRICE':
            const _strikePrice = state.strikePrice
            _strikePrice[payload[0]] = payload[1]
            return { ...state, strikePrice: _strikePrice }
        default:
            break;
    }
}