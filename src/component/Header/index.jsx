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
		const { collapsed, username, fnToggle, fnLoginout } = this.props;
		const menu = (
			<Menu>
				<Menu.Item>
					<div onClick={fnLoginout}><Icon type="poweroff" />　退出登录</div>
				</Menu.Item>
			</Menu>
		);
		return (
			<Header className="m-header" style={{ background: '#fff', padding: 0 }}>
				<Icon
					className="trigger"
					type={collapsed ? 'menu-unfold' : 'menu-fold'}
					onClick={fnToggle}
				/>
				<div className="u-user">
					<Dropdown overlay={menu}>
						<div>
							欢迎您，{username} <Icon type="down" />
						</div>
					</Dropdown>
				</div>
			</Header>
		);
	}
}

export default withRouter(HeaderComponent);
