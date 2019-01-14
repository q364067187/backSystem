import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import Title from 'APP/components/Title';

import Search from './subpage/search';
import List from './subpage/list';

class ProductIndex extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    	this.state = {
    		search: {},
        	refresh: 1,
    	};
	}
	render() {
		return (
			<div>
            	<Title title="商品管理" />
            	<Link to="/product/save">
            		<Button className="m-add-btn" size="large" type="primary" icon="plus">
            			添加商品
            		</Button>
            	</Link>
				<Search searchHandle={this.searchHandle.bind(this)} />
				<List searchParams={this.state.search} refresh={this.state.refresh} />
            </div>
		);
	}
	// 搜索
	searchHandle(values){
		this.setState({
			search: values,
			refresh: Math.random()
		});
	}
}

export default ProductIndex;
