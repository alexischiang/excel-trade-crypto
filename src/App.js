import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import './App.css';
import { BinancePage } from './pages'
import { useSnackbar } from 'notistack';
import { Divider } from 'antd';
import { Button, Space } from 'antd'
const App = () => {
	const { enqueueSnackbar } = useSnackbar();

	const history = useHistory()

	const [currentEx, setCurrentEx] = useState('')

	const changeExchange = (exchange) => {
		setCurrentEx(exchange)
		history.push('/' + exchange)
		enqueueSnackbar(`${exchange} now!`, {
			variant: 'success',
			autoHideDuration: 1500
		})
	}

	useEffect(() => {
		setCurrentEx(history.location.pathname.substring(1).toUpperCase())
	}, [])

	return (
		<div className="App">
			<Space>
				{
					['BINANCE', 'HUOBI', 'DERIBIT'].map((exchange, i) => {
						return <Button
							key={i}
							onClick={() => changeExchange(exchange)}
							className={currentEx == exchange && 'active-btn'}
							disabled={currentEx == exchange}
						>{exchange.toUpperCase()}</Button>
					})
				}
				<div>{history.location.pathname}</div>
			</Space>

			<Divider />

			<div className={'router-view'}>
				<Switch>
					<Route path='/binance' component={BinancePage} />
				</Switch>
			</div>

		</div>
	);
}

export default App;
