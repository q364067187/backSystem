import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { message, Button } from 'antd';

import Title from 'APP/components/Title';

import Form from './subpage/form';

class ProductIndex extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		let { categoryId = 0 } = this.props.match.params;
		return (
			<div>
            	<Title title="添加品类" />
            	<Button className="m-add-btn" size="large" type="primary" icon="plus" onClick={this.backHandle.bind(this)}>
            		返回
            	</Button>
                <Form submitSuccess={this.submitSuccess.bind(this)} categoryId={categoryId} />
            </div>
		);
	}
	backHandle(parentId = this.props.match.params.parentId){
	    this.props.history.push('/product/category/' + parentId);
	}
	// 成功提交后回调 跳转到当前选择的父品类页面下
	submitSuccess(parentId) {
	    message.success('提交成功！');
	    setTimeout(() => {
	        this.backHandle(parentId);
	    }, 100);
	}
}

export default ProductIndex;
