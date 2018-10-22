import React from "react";
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { withRouter } from 'react-router-dom';

class App extends React.Component{
	constructor(props, context){
		super(props, context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		return (
			<div className="m-wholeHeight">
				{this.props.children}
			</div>
		)
	}
};

export default withRouter(App);
