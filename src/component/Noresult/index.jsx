import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './index.less';

class NoResult extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
	    	className: '',
	    	title: '暂无数据',
	    	info: ''
	    };
	}
	render() {
		const { className, title, info } = this.state;
	    return (
            <div className={"m-prompt-part s-noresult " + className}>
            	<span className="u-title">{title}</span>
            	<span className="u-info">{info}</span>
            </div>
	    )
	}
	componentDidMount(){
		const type = this.props.type || 'nothing';
		this.setState({
			className: 'empty-' + type
		});
	}
}

export default NoResult;
