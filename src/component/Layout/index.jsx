import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { withRouter } from 'react-router-dom';

import { Layout } from 'antd';
const { Content } = Layout;

import Sider from 'SRC/component/Sider';
import Header from 'SRC/component/header';
import './index.less';

class LayoutComponent extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
			collapsed: false,
		};
	}
	render() {
		const { collapsed } = this.state;
		const { username } = this.props.userInfo;
		return (
			<Layout className="g-layout">
				<Sider collapsed={collapsed} />
				<Layout>
					<Header username={username} collapsed={collapsed} fnToggle={this.fnToggle.bind(this)} fnLoginout={this.props.fnLoginout} />
					<Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
						{this.props.children}
					</Content>
				</Layout>
			</Layout>
		);
	}
	// 展开收缩侧边栏
	fnToggle() {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}
}

export default withRouter(LayoutComponent);
