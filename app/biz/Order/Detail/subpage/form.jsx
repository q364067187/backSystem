import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Form, Row, Col, message, Table, Button, Modal } from 'antd';
const FormItem = Form.Item;
const confirm = Modal.confirm;

import { sendOrder } from 'APP/fetch/order';

class FormSubpage extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
	    const { data = {} } = this.props;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const formItemLayout = {
			labelCol: {
				span: 5
			},
			wrapperCol: {
				span: 14
			}
		};

		// 给表格加key
		data.orderItemVoList.forEach((item, index) => {
			item.key = index;
		});

		const columns = [
			{
				title: '商品图片',
				dataIndex: 'productImage',
				align: 'center',
				width: '30%',
				render: (text, record) => (
					<div className="u-orderProduct-table">
						<img src={`${data.imageHost}${text}`} alt={record.productName} />
					</div>
				)
			}, {
				title: '商品信息',
				dataIndex: 'productName',
				align: 'center',
				width: '30%',
			}, {
				title: '单价',
				dataIndex: 'currentUnitPrice',
				align: 'center',
				render: text => '￥' + text
			}, {
				title: '数量',
				dataIndex: 'quantity',
				align: 'center',
			}, {
				title: '合计',
				dataIndex: 'totalPrice',
				align: 'center',
				render: text => '￥' + text
			}
		];
		return (
			<Form>
				<FormItem
					label="订单号"
					{...formItemLayout}
					>
					{data.orderNo}
				</FormItem>
				<FormItem
					label="创建时间"
					{...formItemLayout}
					>
					{data.createTime}
				</FormItem>
				<FormItem
					label="收件人"
					{...formItemLayout}
					>
					{data.shippingVo.receiverName}，
					{data.shippingVo.receiverProvince}
					{data.shippingVo.receiverCity}
					{data.shippingVo.receiverAddress}
					{data.shippingVo.receiverMobile || data.shippingVo.receiverPhone}
				</FormItem>
				<FormItem
					label="订单状态"
					{...formItemLayout}
					>
					{data.statusDesc}
					{
						data.status === 20 &&　
						<Button type="primary" onClick={this.sendHandle.bind(this)}>
							立即发货
						</Button>
					}
				</FormItem>
				<FormItem
					label="支付方式"
					{...formItemLayout}
					>
					{data.paymentTypeDesc}
				</FormItem>
				<FormItem
					label="订单金额"
					{...formItemLayout}
					>
					￥ {data.payment}
				</FormItem>
				<FormItem
					label="商品列表"
					{...formItemLayout}
					>
					<Table size="small" dataSource={data.orderItemVoList} columns={columns} />
				</FormItem>
			</Form>
		);
	}
	// 发货
	sendHandle(){
	    const { data = {} } = this.props;
		confirm({
			title: '是否确认给订单号为' + data.orderNo + '的订单发货？',
			cancelText: "取消",
			okText: "确定",
			onOk: () => {
				return sendOrder({
					orderNo : data.orderNo
				}).then(res => {
					message.success('操作成功！');
					// 更新数据
					this.props.getData();
				}).catch((e) => {
					console.log(e);
				});
			}
		});
	}
}

export default Form.create()(FormSubpage);
