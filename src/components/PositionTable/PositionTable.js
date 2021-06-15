import React from 'react'
import { Table } from 'antd'
import BigNumber from 'bignumber.js'
export const PositionTable = ({ dataSource }) => {
    const columns = [
        {
            title: '名称',
            dataIndex: 'symbol',
        },
        {
            title: '方向',
            dataIndex: 'side',
            render: d => (
                <span className={d === 'LONG' ? 'positive-number' : 'negative-number'}>{
                    d === 'LONG' ? '买' : '卖'
                }</span>
            )
        },
        {
            title: '持仓数量',
            dataIndex: 'quantity',
        },
        {
            title: '可平仓数量',
            dataIndex: 'reducibleQty',
        },
        {
            title: '未实现盈亏',
            dataIndex: 'unrealizedPNL',
        },
        {
            title: '当前市值',
            dataIndex: 'markValue',
        },
        {
            title: '收益率',
            dataIndex: 'ror',
            render: d => (
                <span className={d > 0 ? 'positive-number' : 'negative-number'}>{new BigNumber(d).multipliedBy(100).toString()}%</span>
            )
        }
    ];

    return <Table columns={columns} dataSource={dataSource} rowKey={d => d.symbol} className={'position-table'} pagination={false} />
}

