import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, Icon, Input, Button, message } from 'antd';
const FormItem = Form.Item;

import * as userInfoActionsFromOtherFile from 'SRC/actions/userInfo';
import { USERNAME }                      from "SRC/config/StoreKey";
import { postLogin }                     from "SRC/fetch/login";
import './index.less';

class Login extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
    	const { getFieldDecorator } = this.props.form;
	    return (
            <div className="m-login-page">
            	<div className="u-login-wrap">
	            	<div className="u-login-tit">管理员登录</div>
	            	<Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
						<FormItem>
							{getFieldDecorator('username', {
								rules: [{ required: true, message: '请输入用户名' }],
							})(
								<Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)', fontSize: "16px" }} />} placeholder="用户名" />
							)}
						</FormItem>
						<FormItem>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: '请输入密码' }],
							})(
								<Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)', fontSize: "16px" }} />} type="password" placeholder="密码" />
							)}
						</FormItem>
						<FormItem>
							<Button type="primary" size="large" htmlType="submit" className="login-form-button">登 录</Button>
						</FormItem>
	            	</Form>
            	</div>
            </div>
	    )
	}
	componentWillMount(){
		const username = JSAPI.getCookie(USERNAME);
        // 登录了就跳主功能页
        if(username){
        	this.props.history.replace('/');
        }
	}
	// 提交
	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('提交对象为: ', values);
				this.postLogin(values);
			}
		});
	}
	// 提交登录
	postLogin(values){
		postLogin(values).then(res => {
			message.success('登录成功！');
			const username = res.data['username'];
			// 存cookie
			JSAPI.setCookie({
			    [USERNAME]: {
			        value: username
			    }
			});
			// 存redux
			const userInfo = this.props.userInfo;
			userInfo.username = username;
        	this.props.userInfoActions.login(userInfo);

			const router = decodeURIComponent(JSAPI.getQuery('redirect') || '/');
			this.props.history.replace(router);
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
)(Form.create()(Login)));
