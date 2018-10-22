import React from 'react';
import { Route, Switch } from 'react-router-dom';

// 主要功能
import App from 'SRC/biz';
import MainRouter from "SRC/router/MainRouter";

// 登录页
import Login from 'SRC/biz/Login';

window.restPath = APPCONFIG.restPath;

class AppRouter extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return (
			<App>
				<Switch>
					<Route path="/login" component={Login}/>
					<Route path="/" component={MainRouter} />
				</Switch>
			</App>
		)
	}
}

export default AppRouter;
