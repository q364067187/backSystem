import React from 'react';
import { Route, Switch } from 'react-router-dom';

// 主要功能
import App      from 'APP/biz/logined';
import Notfound from 'APP/biz/404';

import Home          from 'APP/biz/Home';					// 首页
import ProductRouter from 'APP/biz/Product/router';			// 产品
import User          from 'APP/biz/User';					// 用户
import Order         from 'APP/biz/Order/router';			// 订单

class AppRouter extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			login: false
		};
	}
	render(){
		return (
			<App>
				<Switch>
				    <Route path="/" exact component={Home}/>
				    {/*商品*/}
					<Route path="/product" component={ProductRouter} />
					{/*用户*/}
					<Route path="/user" component={User} />
					{/*订单*/}
					<Route path="/order" component={Order} />
					<Route component={Notfound} />
				</Switch>
			</App>
		);
	}
}

export default AppRouter;
