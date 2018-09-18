import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import { HashRouter, Router, Route, Switch } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
let history = createHashHistory();

import './static/less/base.less';

import Layout from 'SRC/component/Layout';
import Home from 'SRC/biz/Home';

class App extends React.Component{
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render(){
		return (
			<Router history={history} className="m-wholeHeight">
				<Layout>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/product" component={Home} />
					</Switch>
				</Layout>
			</Router>
		);
	}
};

ReactDOM.render(
	<HashRouter>
		<App />
	</HashRouter>,
	document.getElementById('root')
);
