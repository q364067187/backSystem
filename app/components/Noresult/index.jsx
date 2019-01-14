import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './index.less';

class NoResult extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
	    	className: '-nothing',	// 默认className图标
	    	title: this.props.title || '暂无数据',
	    	info: ''
	    };
	}
	render() {
		let { className, title, info } = this.state;
		const { type } = this.props;
		const display = this.props.display || 'block';
		className = 'icon-empty' + (type ? ('-' + type) : className);
	    return (
            <div className={`m-prompt-part s-noresult s-${display}`}>
            	{
            		display === 'inline'
            		? <span>{title}</span>
            		: [
	            		<span className="u-icon" key="1"><i className={"icon " + className}></i></span>,
	            		<span className="u-title" key="2">{title}</span>,
	            		<span className="u-info" key="3">{info}</span>
            		]
            	}
            </div>
	    )
	}
}

export default NoResult;
