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
					<Menu.Item key="sub-home">
						<NavLink replace exact className="u-nav-link" activeClassName="s-nav-cur" to="/">
							<Icon type="home" />
							<span className="nav-text">首页</span>
						</NavLink>
					</Menu.Item>
					<SubMenu
						key="sub-pro"
						title={
							<span>
								<Icon type="pushpin" theme="outlined" />
								<span>商品</span>
							</span>
						}
						>
						<Menu.Item key="sub-pro-index">
							<NavLink replace className="u-nav-link" activeClassName="s-nav-cur" to="/product/index">商品管理</NavLink>
						</Menu.Item>
						<Menu.Item key="sub-pro-category">
							<NavLink replace className="u-nav-link" activeClassName="s-nav-cur" to="/product/category">品类管理</NavLink>
						</Menu.Item>
					</SubMenu>
					<SubMenu
						key="sub-user"
						title={
							<span>
								<Icon type="user" theme="outlined" />
								<span>用户</span>
							</span>
						}
						>
						<Menu.Item key="sub-user-index">
							<NavLink replace className="u-nav-link" activeClassName="s-nav-cur" to="/user">用户列表</NavLink>
						</Menu.Item>
					</SubMenu>
					<SubMenu
						key="sub-order"
						title={
							<span>
								<Icon type="file-text" />
								<span>订单</span>
							</span>
						}
						>
						<Menu.Item key="sub-order-index">
							<NavLink replace className="u-nav-link" activeClassName="s-nav-cur" to="/order">订单列表</NavLink>
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
			openKeys = ['sub-pro'];
		}else if(/\/user/.test(href)){
			openKeys = ['sub-user'];
		}else if(/\/order/.test(href)){
			openKeys = ['sub-order'];
		}
		this.setState({
			openKeys
		});
	}
}

export default withRouter(SiderComponent);
