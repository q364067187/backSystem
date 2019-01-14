import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Form, Row, Col, message } from 'antd';
const FormItem = Form.Item;

import { getCategory } from 'APP/fetch/product.js';

class FormSubpage extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    const { data = {} } = this.props;
	    const subImages = data.subImages && data.subImages.split(',');
	    const fileList = subImages && subImages.length ? subImages.map((item, index) => {
	    	return {
				uid: index,
				url: data.imageHost + item
	    	};
	    }) : [];
		this.state = {
			loading: true,
			hasError: false,
			categoryFirst: null,
			categorySecond: null,
			fileList
		};
	}
	render() {
	    const { data = {} } = this.props;
		const { categoryFirst, categorySecond, fileList } = this.state;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const formItemLayout = {
			labelCol: {
				span: 5
			},
			wrapperCol: {
				span: 14
			}
		};
		return (
			<Form>
				<FormItem
					label="商品名称"
					{...formItemLayout}
					>
					{data.name}
				</FormItem>
				<FormItem
					label="商品描述"
					{...formItemLayout}
					>
					{data.subtitle}
				</FormItem>
				<FormItem
					label='分类'
					{...formItemLayout}
					>
					<Row gutter={24}>
						<Col span={12}>
							{
								data.parentCategoryId == 0 && data.categoryId == 0
								? '无'
								: categoryFirst
									? data.parentCategoryId == 0
										? this.getCategoryName('first', data.categoryId)
										: this.getCategoryName('first', data.parentCategoryId)
									: '获取中...'
							}
						</Col>
						{
							categorySecond && data.categoryId &&
							<Col span={12}>
								{this.getCategoryName('second', data.categoryId)}
							</Col>
						}
					</Row>
				</FormItem>
				<FormItem
					label="商品图片"
					{...formItemLayout}
					className={`u-vt ${fileList.length ? 'ant-upload-list-wrap' : ''}`}
					>
					{
						fileList.length
						? <div className="u-img-wrap">
							{
								fileList.map((item, index) => <div className="u-img-cell" key={index}><img src={item.url} /></div>)
							}
						</div>
						: '无'
					}
				</FormItem>
				<FormItem
					label="商品价格"
					{...formItemLayout}
					>
					{data.price} 元
				</FormItem>
				<FormItem
					label="商品库存"
					{...formItemLayout}
					>
					{data.stock} 件
				</FormItem>
				<FormItem
					label="产品详情"
					{...formItemLayout}
					>
					<div className="u-html-part" dangerouslySetInnerHTML={{__html: data.detail || '无'}}></div>
				</FormItem>
			</Form>
		);
	}
	componentDidMount() {
		const { data = {} } = this.props;
		if(data.parentCategoryId == 0 && data.categoryId == 0) return;
	    this.getDataCategory({ categoryId: 0, type: 'first' }).then(res => {
	    	if(data.parentCategoryId !== 0){
	    		this.getDataCategory({ categoryId: data.parentCategoryId, type: 'second' });
	    	}
	    });
	}
	componentWillUnmount() {
	    this.setState = (state,callback) => {
	    	return;
	    };
	}
    // 获取分类
    getDataCategory({ categoryId, type }){
    	return new Promise((resolve, reject) => {
	    	this.setState({
	    		loading: true
	    	});
	    	getCategory({ categoryId }).then(res => {
	    		const category = res.data.map((item, index) => {
	    			return {
	    				name: item.name,
	    				value: item.id
	    			};
	    		});
	    		this.setState({
	    			[type === 'first' ? 'categoryFirst' : 'categorySecond']: category,
					loading: false,
					hasError: false
	    		});
	    		resolve(res);
	    	}).catch(e => {
	    		console.log(e);
	    		this.setState({
	    			loading: false,
	    			hasError: e
	    		});
	    		reject(e)
	    	});
    	});
    }
    // 获取分类名
    getCategoryName(type, id){
		const { categoryFirst, categorySecond } = this.state;
		let result;
		let useArr = type === 'first' ? categoryFirst : categorySecond;
		useArr.some(item => {
			if(item.value === id){
				result = item.name;
				return true;
			}
		});
		if(result == null) result = '分类参数有误';
		return result;
    }
}

export default Form.create()(FormSubpage);
