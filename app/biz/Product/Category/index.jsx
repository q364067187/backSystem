import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import Title from 'APP/components/Title';

import List from './subpage/list';
import './index.less';

class ProductCategory extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		let { categoryId = 0 } = this.props.match.params;
		return (
			<div id="t_product_category">
            	<Title title="品类管理" />
            	<div className="m-add-btn-group">
	            	<Link to={`/product/category-add/${categoryId}`}>
	            		<Button className="m-add-btn" size="large" type="primary" icon="plus">
	            			添加品类
	            		</Button>
	            	</Link>
	            	{
	            		categoryId !== 0 &&
	            		<Button className="m-add-btn" size="large" type="primary" icon="plus" onClick={this.backHandle.bind(this)}>
	            			返回
	            		</Button>
	            	}
            	</div>
            	<div className="u-prompt">
					父品类ID：{categoryId}
            	</div>
				<List categoryId={categoryId} />
			</div>
		);
	}
	backHandle(){
		this.props.history.push('/product/category');
	}
}

export default ProductCategory;
