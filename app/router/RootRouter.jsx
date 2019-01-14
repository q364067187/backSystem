import React from 'react';
import { Route, Switch } from 'react-router-dom';

// 入口文件
import Root from 'APP/biz';

// 登录
import Login from 'APP/biz/Login';

// 功能
import AppRouter from "APP/router/AppRouter";

class RootRouter extends React.Component {
	constructor(props){
		super(props);
	}
	render(){
		return (
			<Root>
				<Switch>
					<Route path="/login" component={Login}/>
					<Route path="/" component={AppRouter} />
				</Switch>
			</Root>
		)
	}
}

export default RootRouter;
