import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Form, Row, Col, Input, Select, Button, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import { delEmptyPar } from 'APP/config/pageApi';

class Search extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form
				className="ant-advanced-search-form"
				onSubmit={this.searchHandle.bind(this)}
				>
				<Row gutter={24}>
					<Col span={8}>
						<FormItem
							>
							{
								getFieldDecorator('type', {
									initialValue: 'productId'
								})(
									<Select>
										<Option value="productId">按商品ID查询</Option>
										<Option value="productName">按商品名称查询</Option>
									</Select>
								)
							}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem
							>
							{
								getFieldDecorator('value', {

								})(
									<Input placeholder="关键词" />
								)
							}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={8}>
						<Button type="primary" htmlType="submit">搜索</Button>
						<Button style={{ marginLeft: 8 }} onClick={this.resetHandle.bind(this)}>清空</Button>
					</Col>
				</Row>
			</Form>
		);
	}
	// 搜索
	searchHandle(e){
		if(e) e.preventDefault();
		this.props.form.validateFields((err, values) => {
			values[values.type] = values.value;
			delete values.type;
			delete values.value;
			delEmptyPar(values);
			console.log('提交对象为: ', values);
			this.props.searchHandle(values);
		});
	}
	// 清空
	resetHandle(){
		this.props.form.resetFields();
	}
}

export default Form.create()(Search);
