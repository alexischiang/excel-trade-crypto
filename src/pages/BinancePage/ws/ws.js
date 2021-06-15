import _ from 'underscore'
import { message } from 'antd'
import { beautify } from './beautify'
import lodash from 'lodash'
import ReconnectingWebSocket from 'reconnecting-websocket'
const BinanceErrors = Object.freeze({
    INVALID_LISTEN_KEY: -1125
});

const _baseUrl = 'wss://vstream.binance.com/ws/';
const _combinedBaseUrl = 'wss://vstream.binance.com/stream?streams=';
const _sockets = {};
const _beautify = beautify;

const streams = {
    depth: symbol => `${symbol.toLowerCase()}@depth`,
    depthLevel: (symbol, level) =>
        `${symbol.toLowerCase()}@depth${level}`,
    kline: (symbol, interval) =>
        `${symbol.toLowerCase()}@kline_${interval}`,
    aggTrade: symbol => `${symbol.toLowerCase()}@aggTrade`,
    trade: symbol => `${symbol.toLowerCase()}@trade`,
    ticker: symbol => `${symbol}@ticker`,
    allTickers: () => '!ticker@arr'
};

// Reference to the setInterval timer for sending keep alive requests in onUserData
const _userDataRefresh = {
    intervaId: false,
    failCount: 0
};

const _setupWebSocket = (eventHandler, path, isCombined, setWsStatus) => {
    if (_sockets[path]) {
        return _sockets[path];
    }
    path = (isCombined ? _combinedBaseUrl : _baseUrl) + path;
    const ws = new ReconnectingWebSocket(path);

    ws.onopen = () => {
        console.log('Binance Option Websocket connected!')
        if (setWsStatus) {
            setWsStatus(true)
        }
        // 期权ws数据默认是GZIP压缩数据 连接成功后发送 {"method":"BINARY", "params":["false"], "id":1} 转换为文本数据
        ws.send(JSON.stringify({ "method": "BINARY", "params": ["false"], "id": 1 }))
    }

    const onMessage = (message) => {
        message = message.data
        let event;
        try {
            event = JSON.parse(message);
        } catch (e) {
            event = message;
        }
        if (_beautify) {
            if (event.stream) {
                event.data = _beautifyResponse(event.data);
            } else {
                event = _beautifyResponse(event);
            }
        }


        // 跳过第一条响应 {id:1}
        if (!Object.keys(event).includes('id')) {
            eventHandler(event)
        }
    }

    ws.onmessage = (lodash.throttle(onMessage, 1000));

    ws.addEventListener('error', () => message.error('断开'))

    ws.onclose = () => {
        console.log('关闭')
        if (setWsStatus) {
            setWsStatus(false)
        }
    }

    return ws;
}

const _beautifyResponse = (data) => {
    if (_.isArray(data)) {
        return _.map(data, event => {
            if (event.e) {
                return beautify(event, event.e + 'Event');
            }
            return event;
        });
    } else if (data.e) {
        return beautify(data, data.e + 'Event');
    }
    return data;
}

const _clearUserDataInterval = () => {
    if (_userDataRefresh.intervaId) {
        clearInterval(_userDataRefresh.intervaId);
    }

    _userDataRefresh.intervaId = false;
    _userDataRefresh.failCount = 0;
}

const _sendUserDataKeepAlive = (binanceRest, response) => {
    return binanceRest.keepAliveUserDataStream(response).catch(e => {
        _userDataRefresh.failCount++;
        const msg =
            'Failed requesting keepAliveUserDataStream for onUserData listener';
        if (e && e.code === BinanceErrors.INVALID_LISTEN_KEY) {
            console.error(
                new Date(),
                msg,
                'listen key expired - clearing keepAlive interval',
                e
            );
            _clearUserDataInterval();
            return;
        }
        console.error(
            new Date(),
            msg,
            'failCount: ',
            _userDataRefresh.failCount,
            e
        );
    });
}


export const onTrade = (symbol, eventHandler) => {
    return _setupWebSocket(eventHandler, streams.trade(symbol));
}

export const onTicker = (symbol, eventHandler, setStatus) => {
    return _setupWebSocket(eventHandler, streams.ticker(symbol), _, setStatus);
}

export const onAllTickers = async (streams, eventHandler) => {
    let streamsArr = []
    streams.forEach(item => {
        console.log(item.symbol)
        streamsArr.push(streams.ticker(item.symbol))
    })

    onCombinedStream(streamsArr, eventHandler);
}

export const onUserData = (binanceRest, eventHandler, interval = 60000) => {
    _clearUserDataInterval();
    return binanceRest.startUserDataStream().then(response => {
        _userDataRefresh.intervaId = setInterval(
            () => _sendUserDataKeepAlive(binanceRest, response),
            interval
        );
        _userDataRefresh.failCount = 0;

        return _setupWebSocket(eventHandler, response.listenKey);
    });
}

export const onCombinedStream = (streams, eventHandler, setWsStatus) => {
    return _setupWebSocket(eventHandler, streams.join('/'), true, setWsStatus);
}

