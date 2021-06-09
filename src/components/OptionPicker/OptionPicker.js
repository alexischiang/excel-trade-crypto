import React, { useEffect, useState } from 'react'

import { Cascader, } from 'antd';
import axios from 'axios'

export const OptionPicker = ({ value = {}, onChange, form }) => {
    const [pairs, setPairs] = useState([])
    const [symbol, setSymbol] = useState([])

    // 数组去重
    const uniqueSorted = (arr) => {
        let res = arr.filter((item, index, arr) => {
            return arr.indexOf(item) == index;
        });
        return res.sort((a, b) => a - b);
    }

    /**
     * 获取所有交易对
     */
    const getAllPairs = () => {
        axios.get('http://localhost:80/binance/voption/info').then(d => {
            const pairsArr = d.data.message
            let l1 = [], l2 = [], l3 = [], l4 = ['C', 'P']
            pairsArr.forEach(({ symbol }) => {
                const _symbol = symbol.split('-')
                const coin = _symbol[0]
                const date = _symbol[1]
                const price = _symbol[2]
                l1.push(coin)
                l2.push(+date)
                l3.push(+price)
            })
            // 构造级联选择器数据结构
            const res = uniqueSorted(l1).map((coin) => {
                return {
                    value: coin,
                    label: coin,
                    children: uniqueSorted(l2).map((date) => {
                        return {
                            value: date,
                            label: date,
                            children: uniqueSorted(l3).map(price => {
                                return {
                                    value: price,
                                    label: price,
                                    children: uniqueSorted(l4).map(d => {
                                        return {
                                            value: d,
                                            label: d
                                        }
                                    })
                                }
                            })
                        }
                    }
                    )
                }
            })
            setPairs(res)
        })
    }

    const triggerChange = (v) => {
        onChange({ ...value, ...v })
    }

    const onPairChange = (v) => {
        if (!('symbol' in value)) {
            setSymbol(v)
        }

        triggerChange({
            symbol: v
        })

        try {
            form.resetFields(['price', 'quantity'])
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllPairs()
    }, [])


    return <Cascader
        placeholder='请选择交易对'
        options={pairs}
        value={value.symbol || symbol}
        onChange={onPairChange}
    />
}