import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Icon, Input, Button, message } from 'antd';
const FormItem = Form.Item;

import * as userInfoActionsFromOtherFile      from 'APP/actions/userInfo';
import { postLogin }                          from "APP/fetch/login";
import { saveLogin, loginJump, goAfterLogin } from "APP/config/pageApi";

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
		loginJump(this.props);
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
		const hide = message.loading('登录中，请稍候', 0);
		postLogin(values).then(res => {
			hide();
			message.success('登录成功！');
			saveLogin(res.data, this.props);

			// 登录后跳转
			goAfterLogin(this.props);
		}).catch(e => {
			console.log(e);
			hide();
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
