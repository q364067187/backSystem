import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { NavLink, withRouter } from 'react-router-dom';

import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

import './index.less';

class SiderComponent extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.state = {
			openKeys: null
		};
	}
	render() {
		const { openKeys } = this.state;
		return (
			<Sider className="m-sidebar"
				trigger={null}
				collapsible
				collapsed={this.props.collapsed}
				>
				<div className="logo" />
				<Menu theme="dark" mode="inline" defaultOpenKeys={openKeys} selectable={false} forceSubMenuRender={true}>
					<Menu.Item key="1">
						<NavLink replace exact className="u-nav-link" activeClassName="s-nav-cur" to="/">
							<Icon type="home" />
							<span className="nav-text">首页</span>
						</NavLink>
					</Menu.Item>
					<SubMenu
						key="sub_pro"
						title={
							<span>
								<Icon type="pushpin" theme="outlined" />
								<span>商品</span>
							</span>
						}
						>
						<Menu.Item key="sub_pro_manage">
							<NavLink replace className="u-nav-link" activeClassName="s-nav-cur" to="/product">商品管理</NavLink>
						</Menu.Item>
					</SubMenu>
					<SubMenu
						key="sub_user"
						title={
							<span>
								<Icon type="user" theme="outlined" />
								<span>用户</span>
							</span>
						}
						>
						<Menu.Item key="sub_user_list">
							<NavLink replace className="u-nav-link" activeClassName="s-nav-cur" to="/user">用户列表</NavLink>
						</Menu.Item>
					</SubMenu>
				</Menu>
			</Sider>
		);
	}
	componentWillMount(){
		this.setSub();
	}
	// 设置展开下拉导航
	setSub(){
		let href = location.href;
		let openKeys = [];
		if(/\/product/.test(href)){
			openKeys = ['sub_pro'];
		}else if(/\/user/.test(href)){
			openKeys = ['sub_user'];
		}
		this.setState({
			openKeys
		});
	}
}

export default withRouter(SiderComponent);
