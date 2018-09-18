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
						key="sub1"
						title={
							<span>
								<Icon type="shop" />
								<span>商品</span>
							</span>
						}
						>
						<Menu.Item key="sub1-1">
							<NavLink replace className="u-nav-link" activeClassName="s-nav-cur" to="/product">商品管理</NavLink>
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
			openKeys = ['sub1'];
		}
		this.setState({
			openKeys
		});
	}
}

export default withRouter(SiderComponent);
