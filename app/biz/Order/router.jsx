import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Route, Switch, Redirect } from 'react-router-dom';

import OrderIndex  from 'APP/biz/Order/Index';
import OrderDetail from 'APP/biz/Order/Detail';

class OrderRouter extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		return (
			<Switch>
				<Route path="/order/index" component={OrderIndex}/>
				<Route path="/order/detail/:id?" component={OrderDetail}/>
				<Redirect from="/order" to="/order/index"/>
			</Switch>
		);
	}
}

export default OrderRouter;
