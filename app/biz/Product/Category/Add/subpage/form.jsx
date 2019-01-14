import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Form, Row, Col, Select, Input, Button, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import DataSelect                   from 'APP/components/DataSelect';
import { getCategory, addCategory } from 'APP/fetch/product.js';

class FormSubpage extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.state = {
			loading: true,
			hasError: false,
			category: null
		};
	}
	render() {
		const { category } = this.state;
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
			<Form onSubmit={this.submitHandle.bind(this)}>
				<FormItem
					label='所属品类'
					{...formItemLayout}
					>
					<Row gutter={24}>
						<Col span={12}>
						{
							getFieldDecorator('parentId', {
								initialValue: '',
								rules: [{
									required: true,
									message: '请选择所属品类'
								}],
							})(
								<DataSelect
									{...this.state}
									errorCallback={this.getDataCategory.bind(this)}
									chooseText="请选择所属品类"
									loadingText={'加载所属品类中...'}
									data={category}
									nameFormat={(name) => '/根品类/' + name}
									>
									<Option value={0} key="0">/根品类</Option>
								</DataSelect>
							)
						}
						</Col>
					</Row>
				</FormItem>
				<FormItem
					label="品类名称"
					{...formItemLayout}
					>
					{
						getFieldDecorator('categoryName', {
							rules: [{
								required: true,
								message: '请填写品类名称'
							}],
						})(
							<Input />
						)
					}
				</FormItem>
				<FormItem
					wrapperCol={{
						span: 14,
						offset: 5
					}}
					>
					<Button type="primary" htmlType="submit">提交</Button>
				</FormItem>
			</Form>
		);
	}
	componentDidMount() {
		this.getDataCategory();
	}
	componentDidUpdate(nextProps, nextState) {
		if(nextProps.categoryId === this.props.categoryId) return;
		if(this.state.category == null){
			this.getDataCategory();
		}else{
			this.getCategoryName();
		}
	}
	componentWillUnmount() {
	    this.setState = (state,callback) => {
	    	return;
	    };
	}
    // 获取分类
    getDataCategory(){
    	this.setState({
    		loading: true
    	});
    	getCategory().then(res => {
    		const category = res.data.map((item, index) => {
    			return {
    				name: item.name,
    				value: item.id
    			};
    		});
    		this.setState({
    			category,
				loading: false,
				hasError: false
    		}, this.getCategoryName.bind(this));
    	}).catch(e => {
    		console.log(e);
    		this.setState({
    			loading: false,
    			hasError: e
    		});
    	});
    }
    getCategoryName(){
		let { categoryId = 0 } = this.props;
		this.props.form.setFieldsValue({
			parentId: parseInt(categoryId)
		});
    }
    // 提交数据处理
    submitHandle(e) {
    	if(e) e.preventDefault();
    	this.props.form.validateFields((err, values) => {
    		if (!err) {
    			// 调用提交接口
    			this.postForm(values);
    			console.log('提交对象为: ', values);
    		}
    	});
    }
    // 调用提交接口
    postForm(values, type){
    	const hide = message.loading('提交中，请稍候', 0);
    	addCategory(values).then(res => {
    		hide();
    		// 重置values
    		this.props.form.resetFields();
    		// 执行父页面提交成功方法
    		this.props.submitSuccess(values.parentId);
    	}).catch(e => {
    		console.log(e);
    		hide();
    	});
    }
}

export default Form.create()(FormSubpage);
