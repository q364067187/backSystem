import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { withRouter } from 'react-router-dom';

import { Layout, Icon, Menu, Dropdown } from 'antd';
const { Header } = Layout;

import './index.less';

class HeaderComponent extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const menu = (
			<Menu>
				<Menu.Item>
					<div onClick={this.loginout.bind(this)}><Icon type="poweroff" />　退出登录</div>
				</Menu.Item>
			</Menu>
		);
		return (
			<Header className="m-header" style={{ background: '#fff', padding: 0 }}>
				<Icon
					className="trigger"
					type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
					onClick={this.clickHandle.bind(this)}
				/>
				<div className="u-user">
					<Dropdown overlay={menu}>
						<div>
							欢迎您，admin <Icon type="down" />
						</div>
					</Dropdown>
				</div>
			</Header>
		);
	}
	// 点击切换图标
	clickHandle() {
		this.props.fnToggle();
	}
	// 退出登录
	loginout(){

	}
}

export default withRouter(HeaderComponent);
