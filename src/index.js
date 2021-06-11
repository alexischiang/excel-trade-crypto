import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { HashRouter as Router } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';
import { Option } from './context/OptionContext'

const Office = window.Office;

window.excelRow = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

Office.initialize = () => {
	ReactDOM.render((
		<SnackbarProvider maxSnack={2} hideIconVariant >
			<Router>
				<Option>
					<App />
				</Option>
			</Router>
		</SnackbarProvider>
	), document.getElementById('root'));
};

// ReactDOM.render((
// 	<Router>
// 		<App />
// 	</Router>
// ), document.getElementById('root'));

