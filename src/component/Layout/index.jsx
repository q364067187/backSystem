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
		return (
			<Layout className="g-layout">
				<Sider collapsed={this.state.collapsed} />
				<Layout>
					<Header collapsed={this.state.collapsed} fnToggle={this.toggle.bind(this)} />
					<Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
						{this.props.children}
					</Content>
				</Layout>
			</Layout>
		);
	}
	// 切换侧边栏
	toggle() {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}
}

export default withRouter(LayoutComponent);
