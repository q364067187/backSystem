import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from "react-router-dom";

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
	    return (
            <div className={"m-prompt-part " + className}>
            	<span className="u-title">{title}</span>
            	<span className="u-info">{info}</span>
            </div>
	    )
	}
	componentDidMount(){
		const type = this.props.type[0];
		if(type === '断网'){
			this.setState({
				className: 'empty-network',
				title: '哎呀 断网啦',
				info: '请检查网络后，刷新重试'
			});
		}else if(type === '超时'){
			this.setState({
				className: 'empty-service',
				title: '哎呀 出错啦',
				info: '连接服务器超时，请稍后重试'
			});
		}else if(type === '404'){
			this.setState({
				className: 'empty-service',
				title: '找不到页面',
				info: (
					<span>
						请检查链接地址是否正确，<Link to="/">返回首页</Link>
					</span>
				)
			});
		}else{
			this.setState({
				className: 'empty-service',
				title: '哎呀 出错啦',
				info: '服务器内部错误，请稍后重试'
			});
		}
	}
}

export default NetError;
