import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from "react-router-dom";
import { Divider } from 'antd';

import './index.less';

class NetError extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
	    	className: '',
	    	title: '',
	    	info: ''
	    };
	}
	render() {
		const { className, title, info } = this.state;
		const display = this.props.display || 'block';
		const errorText = this.props.errorText || '获取失败';
	    return (
            <div className={`m-prompt-part s-${display}`}>
            	{
            		display === 'inline'
            		? <span>{errorText}，<a href="javascript:" className="u-impor" onClick={this.retry.bind(this)}>重试</a></span>
            		: [
	            		<span className="u-icon" key="1"><i className={className}></i></span>,
	            		<span className="u-title" key="2">{title}</span>,
	            		<span className="u-info" key="3">{info}</span>
            		]
            	}
            </div>
	    )
	}
	componentDidMount(){
		const { type } = this.props;
		let className = 'icon icon-empty-service',
			title = '哎呀 出错啦',
			infoTitle = type.tips || '服务器内部错误',
			info = <span>{infoTitle}，<a href="javascript:" className="u-impor" onClick={this.retry.bind(this)}>重试</a></span>;
		switch(type.explain){
			case '断网':
				className = 'icon icon-empty-network';
				title = '哎呀 断网啦';
				break;
			case '请求超时':
				title = '哎呀 超时啦';
				break;
			case '404':
				title = '找不到页面';
				info = <span>
					请检查链接地址是否正确，
					<Link to="/">返回首页</Link>
					<Divider type="vertical" />
					<a href="javascript:" className="u-impor" onClick={this.retry.bind(this)}>重试</a>
				</span>
				break;
		}
		this.setState({
			className,
			title,
			info
		});
	}
	// 重试
	retry(){
		const { errorCallback } = this.props;
		if(errorCallback instanceof Function){
			errorCallback();
		}
	}
}

export default NetError;
