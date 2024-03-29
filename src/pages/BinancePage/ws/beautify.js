import _ from 'underscore'

const _beautifications = {
    aggTrades: {
        a: 'aggTradeId',
        p: 'price',
        q: 'quantity',
        f: 'firstTradeId',
        l: 'lastTradeId',
        T: 'timestamp',
        m: 'maker',
        M: 'bestPriceMatch'
    },
    klines: {
        0: 'openTime',
        1: 'open',
        2: 'high',
        3: 'low',
        4: 'close',
        5: 'volume',
        6: 'closeTime',
        7: 'quoteAssetVolume',
        8: 'trades',
        9: 'takerBaseAssetVolume',
        10: 'takerQuoteAssetVolume',
        11: 'ignored'
    },
    bids: [
        {
            0: 'price',
            1: 'quantity',
            2: 'ignored'
        }
    ],
    asks: [
        {
            0: 'price',
            1: 'quantity',
            2: 'ignored'
        }
    ],
    depthUpdateEvent: {
        e: 'eventType',
        E: 'eventTime',
        s: 'symbol',
        U: 'firstUpdateId',
        u: 'lastUpdateId',
        b: 'bidDepthDelta',
        a: 'askDepthDelta'
    },
    bidDepthDelta: [
        {
            0: 'price',
            1: 'quantity',
            2: 'ignored'
        }
    ],
    askDepthDelta: [
        {
            0: 'price',
            1: 'quantity',
            2: 'ignored'
        }
    ],
    klineEvent: {
        e: 'eventType',
        E: 'eventTime',
        s: 'symbol',
        k: 'kline'
    },
    kline: {
        t: 'startTime',
        T: 'endTime',
        s: 'symbol',
        i: 'interval',
        f: 'firstTradeId',
        L: 'lastTradeId',
        o: 'open',
        c: 'close',
        h: 'high',
        l: 'low',
        v: 'volume',
        n: 'trades',
        x: 'final',
        q: 'quoteVolume',
        V: 'volumeActive',
        Q: 'quoteVolumeActive',
        B: 'ignored'
    },
    aggTradeEvent: {
        e: 'eventType',
        E: 'eventTime',
        s: 'symbol',
        a: 'tradeId',
        p: 'price',
        q: 'quantity',
        f: 'firstTradeId',
        l: 'lastTradeId',
        T: 'time',
        m: 'maker',
        M: 'ignored'
    },
    outboundAccountInfoEvent: {
        e: 'eventType',
        E: 'eventTime',
        m: 'makerCommission',
        t: 'takerCommission',
        b: 'buyerCommission',
        s: 'sellerCommission',
        T: 'canTrade',
        W: 'canWithdraw',
        D: 'canDeposit',
        B: 'balances',
        u: 'lastUpdateTime'
    },
    outboundAccountPositionEvent: {
        e: 'eventType',
        E: 'eventTime',
        u: 'lastUpdateTime',
        B: 'balances'
    },
    balances: [
        {
            a: 'asset',
            f: 'availableBalance',
            l: 'onOrderBalance'
        }
    ],
    executionReportEvent: {
        e: 'eventType',
        E: 'eventTime',
        s: 'symbol',
        c: 'newClientOrderId',
        S: 'side',
        o: 'orderType',
        f: 'cancelType', // GTC 'Good till Cancel', IOC: 'Immediate or Cancel'
        q: 'quantity',
        p: 'price',
        P: 'stopPrice',
        F: 'icebergQuantity',
        C: 'originalClientOrderId',
        x: 'executionType',
        X: 'orderStatus',
        r: 'rejectReason',
        i: 'orderId',
        l: 'lastTradeQuantity',
        z: 'accumulatedQuantity',
        L: 'lastTradePrice',
        n: 'commission',
        N: 'commissionAsset',
        m: 'maker',
        T: 'tradeTime',
        t: 'tradeId'
    },
    tradeEvent: {
        e: 'eventType',
        E: 'eventTime',
        s: 'symbol',
        t: 'tradeId',
        p: 'price',
        q: 'quantity',
        b: 'buyerOrderId',
        a: 'sellerOrderId',
        T: 'time',
        m: 'maker',
        M: 'ignored'
    },
    '24hrTickerEvent': {
        e: 'eventType',
        E: 'eventTime',
        s: 'symbol',
        p: 'priceChange',
        P: 'priceChangePercent',
        w: 'weightedAveragePrice',
        x: 'previousClose',
        c: 'currentClose',
        Q: 'closeQuantity',
        b: 'bestBid',
        B: 'bestBidQuantity',
        a: 'bestAskPrice',
        A: 'bestAskQuantity',
        o: 'open',
        h: 'high',
        l: 'low',
        v: 'baseAssetVolume',
        q: 'quoteAssetVolume',
        O: 'openTime',
        C: 'closeTime',
        F: 'firstTradeId',
        L: 'lastTradeId',
        n: 'trades'
    },
    tickerEvent: {
        e: 'eventType',
        E: 'eventTime',
        s: 'symbol',
        o: 'open',
        h: 'high',
        l: 'low',
        c: 'currentClose',
        V: 'volume',
        A: 'DealAmount', // 交易金额
        p: 'priceChangePercent',
        Q: 'closeQuantity',
        F: 'firstTradeId',
        L: 'lastTradeId',
        n: 'trades',
        b: 'sellIV',
        a: 'buyIV',
        d: 'delta',
        t: 'theta',
        g: 'gamma',
        v: 'vega',
        vo: 'volatility', // 波动性
        ao: 'ask1',
        bo: 'bid1',
        mp: 'markPrice'
    }
}

export const beautify = (object, type) => {
    const beautifications = _.isObject(type)
        ? type
        : _beautifications[type];
    if (!beautifications) {
        return object;
    }
    let newItem = {};
    _.each(object, (value, key) => {
        const newKey = beautifications[key] || key;
        if (_.isArray(value)) {
            const newArray = [];
            if (_.isArray(_beautifications[beautifications[key]])) {
                _.each(value, arrayValue => {
                    newArray.push(
                        beautify(
                            arrayValue,
                            _beautifications[beautifications[key]][0]
                        )
                    );
                });
            } else {
                _.each(value, (arrayValue, arrayKey) => {
                    newArray.push(
                        beautify(value, beautifications[arrayKey])
                    );
                });
            }
            newItem[newKey] = newArray;
        } else if (_.isObject(value)) {
            newItem[newKey] = beautify(value, beautifications[key]);
        } else {
            newItem[newKey] = value;
        }
    });
    return newItem;
}