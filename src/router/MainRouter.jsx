import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { message, Modal } from 'antd';
const confirm = Modal.confirm;

import Layout                            from 'SRC/component/Layout';
import * as userInfoActionsFromOtherFile from 'SRC/actions/userInfo';
import { USERNAME }                      from "SRC/config/StoreKey";
import { getRedirect }                   from "SRC/config/pageApi";

// 首页
import Home     from 'SRC/biz/Home';
import User     from 'SRC/biz/User';
import Notfound from 'SRC/biz/404';

class MainRouter extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isLogin: false
		};
	}
	render(){
		const { isLogin } = this.state;
		return (
			<div className="m-wholeHeight">
				{
					isLogin
					? <Layout userInfo={this.props.userInfo} fnLoginout={this.fnLoginout.bind(this)}>
						<Switch>
						    <Route path="/" exact component={Home}/>
							<Route path="/product" component={Home} />
							<Route path="/user" component={User} />
							<Route component={Notfound} />
						</Switch>
					</Layout>
					: ''
				}
			</div>
		)
	}
	componentWillMount(){
		let isLogin;
		const username = JSAPI.getCookie(USERNAME);
		const userInfo = this.props.userInfo;
		userInfo.username = username;
        if(username){
        	// 如果登录了
        	// 存redux
        	this.props.userInfoActions.update(userInfo);
        	isLogin = true;
        }else{
        	// 没登录
        	const redirect = getRedirect();
        	this.props.history.replace('/login' + redirect);
        	isLogin = false;
        }
        this.setState({
        	isLogin
        });
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
				// 删除cookies
				JSAPI.deleteCookie([USERNAME]);
				// 更新redux
        		self.props.userInfoActions.update({});
        		self.props.history.replace('/login');
			},
			onCancel() {},
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
)(MainRouter));
