import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message, Modal } from 'antd';
const confirm = Modal.confirm;

import Layout                                        from 'APP/components/Layout';
import * as userInfoActionsFromOtherFile             from 'APP/actions/userInfo';
import { loginOut, isLogin, needLogin, updateLogin } from 'APP/config/pageApi';
import { getOnline }                                 from 'APP/fetch/common.js';

class Logined extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
	    	login: false,
	    	ready: false,
	    	loading: false
	    };
	}
	render() {
		const { login, ready, loading } = this.state;
		return login && <Layout userInfo={this.props.userInfo} fnLoginout={this.fnLoginout.bind(this)}>
			{
				ready && !loading && this.props.children
			}
		</Layout>
	}
	componentWillMount(){
		let login;
        if(isLogin()){
        	// 如果登录了
        	updateLogin(this.props);
        	login = true;
        }else{
        	// 没登录
        	needLogin(this.props);
        	login = false;
        }
        this.setState({ login });
	}
	componentDidMount() {
		this.setState({
			ready: true
		});
		// 每隔两小时检测是否在线(有cookie的情况下)
		setInterval(() => {
			if(isLogin()){
				getOnline();
			}
		}, 60 * 60 * 2 * 1000);
	}
	// 退出登录
	fnLoginout(){
		const self = this;
		let ref = confirm({
			title: "是否确定退出登录？",
			cancelText: "取消",
			okText: "确定",
			onOk() {
				message.success('退出登录成功！');
				loginOut(self.props);
			}
		});
	}
}

// -------------------redux react 绑定--------------------
function mapStateToProps(state) {
	return {
		userInfo: state.userInfo
	};
}

function mapDispatchToProps(dispatch) {
	return {
		userInfoActions: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
	};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Logined));
