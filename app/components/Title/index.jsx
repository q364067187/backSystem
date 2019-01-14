import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './index.less';

class Title extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
	    return (
            <div className="m-title">{this.props.title}{this.props.children}</div>
	    )
	}
	componentWillMount() {
		this.setTitle(this.props.title);
	}
	// 方便title发生改变时的设置
	componentWillReceiveProps(nextProps) {
		if(nextProps.title === this.props.title) return;
		this.setTitle(nextProps.title);
	}
	// 设置title
	setTitle(title){
		document.title = title + '-后台管理系统';
	}
}

export default Title;
