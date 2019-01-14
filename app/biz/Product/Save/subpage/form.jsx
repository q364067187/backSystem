import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Form, Row, Col, Select, Input, InputNumber, Button, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import Upload                    from 'APP/components/Upload';
import DataSelect                from 'APP/components/DataSelect';
import Editor                    from 'APP/components/Editor';
import { postForm, getCategory } from 'APP/fetch/product.js';

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
			loadingCategoryFirst: true,
			hasErrorCategoryFirst: false,
			categoryFirst: null,
			loadingCategorySecond: true,
			hasErrorCategorySecond: false,
			categorySecond: null,
			fileList
		};
	}
	render() {
	    const { data = {} } = this.props;
		const { categoryFirst, categorySecond, loadingCategoryFirst, hasErrorCategoryFirst, loadingCategorySecond, hasErrorCategorySecond, fileList } = this.state;
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
					label="商品名称"
					{...formItemLayout}
					>
					{
						getFieldDecorator('name', {
							rules: [{
								required: true,
								message: '请填写商品名称'
							}],
							initialValue: data.name
						})(
							<Input />
						)
					}
				</FormItem>
				<FormItem
					label="商品描述"
					{...formItemLayout}
					>
					{
						getFieldDecorator('subtitle', {
							rules: [{
								required: true,
								message: '请填写商品描述'
							}],
							initialValue: data.subtitle
						})(
							<Input />
						)
					}
				</FormItem>
				<FormItem
					label='分类'
					{...formItemLayout}
					>
					<Row gutter={24}>
						<Col span={12}>
						{
							getFieldDecorator('parentCategoryId', {
								initialValue: categoryFirst && data.parentCategoryId ? data.parentCategoryId : '',
							})(
								<DataSelect
									onChange={this.categoryChange.bind(this)}
									errorCallback={this.getDataCategoryFirst.bind(this)}
									chooseText="请选择一级分类"
									loading={loadingCategoryFirst}
									loadingText={'加载一级分类中...'}
									hasError={hasErrorCategoryFirst}
									data={categoryFirst}
								/>
							)
						}
						</Col>
						{
							getFieldValue('parentCategoryId') &&
							<Col span={12}>
								{
									getFieldDecorator('categoryId', {
										initialValue: categorySecond && data.categoryId ? data.categoryId : ''
									})(
										<DataSelect
											errorCallback={this.getDataCategorySecond.bind(this)}
											chooseText="请选择二级分类"
											loading={loadingCategorySecond}
											loadingText={getFieldValue('parentCategoryId') ? '加载二级分类中...' : '请先选择一级分类'}
											hasError={hasErrorCategorySecond}
											data={categorySecond}
										/>
									)
								}
							</Col>
						}
					</Row>
				</FormItem>
				<FormItem
					label="商品图片"
					{...formItemLayout}
					className="u-vt ant-upload-list-wrap"
					>
					{
						getFieldDecorator('subImages', {
							rules: [{
								required: true,
								message: '请上传商品图片'
							}],
							initialValue: data.subImages
						})(
							<Upload
								maxLength="3"
								getUploadUrl={this.getUploadUrl.bind(this)}
								fileList={fileList}
							/>
						)
					}
				</FormItem>
				<FormItem
					label="商品价格"
					{...formItemLayout}
					>
					{
						getFieldDecorator('price', {
							rules: [{
								required: true,
								message: '请填写商品价格'
							}, {
						        pattern: /^\d+(\.\d{1,4})+$|^[0-9]\d*$/,
						        message: `必须大于等于0，小数点后最多四位`,
						    }],
							initialValue: data.price
						})(
							<InputNumber
								className="u-ipt-whole"
								formatter={value => `${value} 元`}
							/>
						)
					}
				</FormItem>
				<FormItem
					label="商品库存"
					{...formItemLayout}
					>
					{
						getFieldDecorator('stock', {
							rules: [{
								required: true,
								message: '请填写商品库存'
							}, {
						        pattern: /^[0-9]\d*$/,
						        message: `必须是大于等于0的整数`,
						    }],
							initialValue: data.stock
						})(
							<InputNumber
								className="u-ipt-whole"
								formatter={value => `${value} 件`}
							/>
						)
					}
				</FormItem>
				<FormItem
					label="产品详情"
					{...formItemLayout}
					>
					{
						getFieldDecorator('detail', {
							rules: [{
								required: true,
								message: '请填写产品详情'
							}],
							initialValue: data.detail
						})(
							<Editor context={data.detail} cbReceiver={this.cbReceiverHandle.bind(this)}/>
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
	    const data = this.props.data;
		this.getDataCategoryFirst().then(res => {
			// 如果是编辑，加载二级分类数据
			if(data && data.parentCategoryId){
				this.getDataCategorySecond(data.parentCategoryId);
			}
		});
	}
	componentWillUnmount() {
	    this.setState = (state,callback) => {
	    	return;
	    };
	}
    // 获取一级分类
    getDataCategoryFirst(){
    	this.setState({
    		loadingCategoryFirst: true
    	});
    	return new Promise((resolve, reject) => {
	    	getCategory().then(res => {
	    		const categoryFirst = res.data.map((item, index) => {
	    			return {
	    				name: item.name,
	    				value: item.id
	    			};
	    		});
	    		this.setState({
	    			categoryFirst,
					loadingCategoryFirst: false,
					hasErrorCategoryFirst: false
	    		});
	    		resolve(res);
	    	}).catch(e => {
	    		console.log(e);
	    		this.setState({
	    			loadingCategoryFirst: false,
	    			hasErrorCategoryFirst: e
	    		});
	    		reject(e);
	    	});
    	});
    }
    // 获取二级分类
    getDataCategorySecond(categoryId){
    	this.setState({
    		loadingCategorySecond: true
    	});
    	getCategory({
    		categoryId
    	}).then(res => {
    		const categorySecond = res.data.map((item, index) => {
    			return {
    				name: item.name,
    				value: item.id
    			};
    		});
    		this.setState({
    			categorySecond,
				loadingCategorySecond: false,
				hasErrorCategorySecond: false
    		});
    	}).catch(e => {
    		console.log(e);
    		this.setState({
    			loadingCategorySecond: false,
    			hasErrorCategorySecond: e
    		});
    	});
    }
    // 一级分类变更
    categoryChange(categoryId){
    	// 重置二级分类
    	this.props.form.setFieldsValue({
    		categoryId: ''
    	});
		this.getDataCategorySecond(categoryId);
    }
    // 提交数据处理
    submitHandle(e) {
    	if(e) e.preventDefault();
    	let { type, data = {} } = this.props;
    	const { categoryFirst, categorySecond } = this.state;
    	this.props.form.validateFields((err, values) => {
    		if (!err) {
    			if(type === 'edit'){
    				values.id = ~~this.props.id;
    			}else{
    				// 新增时，商品状态设为在售
    				values.status = 1;
    			}
    			// 用户读取完分类数据后，如果没有二级分类，分类参数使用一级分类
    			if(categoryFirst && categorySecond){
	    			if(!values.categoryId){
						values.categoryId = values.parentCategoryId;
	    			}
    			}else{
    				// 用户没有读取完分类数据时，取data中的分类数据
					values.categoryId = data.categoryId;
    			}
    			delete values.parentCategoryId;

    			// 调用提交接口
    			this.postForm(values);
    			console.log('提交对象为: ', values);
    		}
    	});
    }
    // 调用提交接口
    postForm(values, type){
    	const hide = message.loading('提交中，请稍候', 0);
    	postForm(values).then(res => {
    		hide();
    		// 重置values
    		this.props.form.resetFields();
    		// 执行父页面提交成功方法
    		this.props.submitSuccess();
    	}).catch(e => {
    		console.log(e);
    		hide();
    	});
    }
    // 修改编辑器内容
    cbReceiverHandle(detail) {
    	this.props.form.setFieldsValue({
    		detail,
    	});
    }
    // 获取上传图片url
	getUploadUrl(fileList){
		this.setState({
			fileList
		});
		// 设置values中的图片
		this.props.form.setFieldsValue({
			subImages: fileList.map(item => item.uri).join(',')
		});
	}
}

export default Form.create()(FormSubpage);
