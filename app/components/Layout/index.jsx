import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { withRouter } from 'react-router-dom';
import { Layout, BackTop } from 'antd';
const { Content } = Layout;

import Sider  from 'APP/components/Sider';
import Header from 'APP/components/header';

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
			<Layout>
				<Sider collapsed={collapsed} />
				<div className="g-layout-wrap">
					<Layout>
						<Header username={username} collapsed={collapsed} fnToggle={this.fnToggle.bind(this)} fnLoginout={this.props.fnLoginout} />
						<div className="g-layout-main">
							<BackTop visibilityHeight={100} target={() => document.querySelector('.g-layout-main')} />
							<Content className="m-content">
								<div className="u-cnt">
									{this.props.children}
								</div>
							</Content>
						</div>
					</Layout>
				</div>
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
