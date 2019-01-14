import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Icon } from 'antd';

import Title       from 'APP/components/Title';
import { getInfo } from 'APP/fetch/home';

import './index.less';

class Home extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
			userCount: '-',
			productCount: '-',
			orderCount: '-'
	    };
	}
	render() {
		const { userCount, productCount, orderCount } = this.state;
	    return (
            <div>
            	<Title title="首页" />
				<div className="m-index-show">
					<div className="u-show-item s-brown">
						<div className="u-count">{userCount}</div>
						<div className="u-name">
							<Icon type="user" theme="outlined" />
							<span className="u-name-main">用户总数</span>
						</div>
					</div>
					<div className="u-show-item s-red">
						<div className="u-count">{productCount}</div>
						<div className="u-name">
							<Icon type="pushpin" theme="outlined" />
							<span className="u-name-main">商品总数</span>
						</div>
					</div>
					<div className="u-show-item s-green">
						<div className="u-count">{orderCount}</div>
						<div className="u-name">
							<Icon type="ordered-list" theme="outlined" />
							<span className="u-name-main">订单总数</span>
						</div>
					</div>
				</div>
            </div>
	    )
	}
	componentWillMount() {
		this.getData();
	}
	getData(){
		getInfo().then(res => {
			this.setState(res.data);
		});
	}
}

export default Home;
