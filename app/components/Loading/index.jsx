import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Spin } from 'antd';

import './index.less';

class Loading extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const loadingText = this.props.loadingText || '正在加载';
		const display = this.props.display || 'block';
	    return <Spin tip={loadingText} className={`m-loading s-${display}`} />
	}
}

export default Loading;
