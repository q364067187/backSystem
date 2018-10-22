import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
const store = configureStore();

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import 'moment/src/locale/zh-cn';

import { HashRouter, Router } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import AppRouter from 'SRC/router/AppRouter';
let history = createHashHistory();

// 静态资源文件
import './static/less/base.less';

ReactDOM.render(
	<Provider store={store}>
		<LocaleProvider locale={zh_CN}>
			<HashRouter>
				<Router history={history}>
					<AppRouter />
				</Router>
			</HashRouter>
		</LocaleProvider>
	</Provider>,
	document.getElementById('root')
);
