import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Route, Switch, Redirect } from 'react-router-dom';

import ProductIndex       from 'APP/biz/Product/Index';
import ProductSave        from 'APP/biz/Product/Save';
import ProductDetail      from 'APP/biz/Product/Detail';
import ProductCategory    from 'APP/biz/Product/Category';
import ProductCategoryAdd from 'APP/biz/Product/Category/Add';

class ProductRouter extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		return (
			<Switch>
				<Route path="/product/index" component={ProductIndex}/>
				<Route path="/product/save/:id?" component={ProductSave}/>
				<Route path="/product/detail/:id?" component={ProductDetail}/>
				<Route path="/product/category/:categoryId?" component={ProductCategory}/>
				<Route path="/product/category-add/:categoryId?" component={ProductCategoryAdd}/>
				<Redirect from="/product" to="/product/index"/>
			</Switch>
		);
	}
}

export default ProductRouter;
