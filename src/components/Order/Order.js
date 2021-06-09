import React, { useState } from 'react'
import { Form, Input, Button, Select, Row, Col } from 'antd';
import { OptionPicker } from '../OptionPicker/OptionPicker'
import { IndexPrice } from '../IndexPrice/IndexPrice'
import axios from 'axios'
import { useSnackbar } from 'notistack';
const { Option } = Select;


const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

export const Order = () => {
    const [form] = Form.useForm();
    const [needPrice, setNeedPrice] = useState(false)
    const [orderLoading, setOrderLoading] = useState(false)

    const { enqueueSnackbar } = useSnackbar();

    const onFinish = (values) => {
        setOrderLoading(true)
        const params = {
            symbol: values.symbol.symbol.join('-'),
            type: values.type,
            price: values.price,
            side: values.side,
            quantity: values.quantity,
            timeInForce: 'GTC'
        }
        console.log(params)
        axios.post('http://localhost:80/binance/voption/newOrder', params).then(d => {
            if (d.data.code == 200) {
                enqueueSnackbar('委托成功', {
                    variant: 'success'
                })
            } else {
                enqueueSnackbar(d.data.message, {
                    variant: 'error'
                })
            }
            setOrderLoading(false)
        })
    };

    return (
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}
            initialValues={{
                type: 'MARKET'
            }}
        >
            <Row gutter={[5, 10]}>
                <Col span={16}>
                    <Form.Item name='symbol' rules={[
                        {
                            required: true,
                            message: '请选择一个交易对',
                        },
                    ]}>
                        <OptionPicker form={form} />
                    </Form.Item>
                </Col>
                <Col span={6} offset={1}>
                    <IndexPrice />
                </Col>
                <Col span={18}>
                    <Form.Item name="price" rules={[
                        {
                            required: needPrice,
                            message: '限价模式请输入价格',
                        },
                    ]}>
                        <Input prefix={'价格'} suffix={'USDT'} disabled={!needPrice} placeholder={needPrice ? '请输入价格' : '市价模式'} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="type">
                        <Select
                            placeholder="类型"
                            onChange={v => {
                                setNeedPrice(v == 'LIMIT')
                                form.validateFields(['price'])
                            }}
                        >
                            <Option value="MARKET">Market</Option>
                            <Option value="LIMIT">Limit</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item name="quantity" rules={[
                        {
                            required: true,
                            message: '请输入张数',
                        },
                    ]}>
                        <Input prefix='数量' suffix='张' />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="side" >
                        <Button type="primary" htmlType="submit" block onClick={() => form.setFields([{
                            name: 'side',
                            value: 'BUY'
                        }])}
                            loading={orderLoading}
                        >
                            买
                      </Button>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="side" >
                        <Button type="primary" htmlType="submit" block danger onClick={() => form.setFields([{
                            name: 'side',
                            value: 'SELL'
                        }])}
                            loading={orderLoading}

                        >
                            卖
                      </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}