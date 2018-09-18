import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class List extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		console.log("render");
	    return (
            <div>
            	{this.props.title}
            </div>
	    )
	}
	componentWillMount() {
		console.log("componentWillMount");
	}
	componentDidMount(){
		console.log("componentDidMount");
	}
	componentWillReceiveProps(nextProps) {
		console.log("componentWillReceiveProps");
	}
}

export default List;
