import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router-dom';
import { Divider, Button, Modal, message } from 'antd';

import DataTable                     from 'APP/components/DataTable';
import { getCategory, editCategory } from 'APP/fetch/product';

class List extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
    		loading    : true,
    		hasError   : false,
    		dataSource : []
        };
	}
	render() {
		let { categoryId } = this.props;
		const columns = [
			{
				title: '序号',
				dataIndex: 'key',
				align: 'center',
			}, {
				title: '品类ID',
				dataIndex: 'id',
				align: 'center',
			}, {
				title: '品类名称',
				dataIndex: 'name',
				align: 'center',
			}, {
				title: '操作',
				dataIndex: 'id',
				key: 'operate',
				align: 'center',
				render: (text, record) => (
					<div>
						<a className="u-impor" onClick={this.changeNameHandle.bind(this, record)}>修改名称</a>
						{
							categoryId == 0 &&
							[
								<Divider type="vertical" key="1" />,
								<Link key="2" className="u-impor" to={`/product/category/${text}`}>查看子品类</Link>
							]
						}
					</div>
				)
			}
		];
	    return (
			<DataTable {...this.state} columns={columns} getData={this.getData.bind(this)} />
	    );
	}
	componentWillMount() {
		this.getData();
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.categoryId === this.props.categoryId) return;
		this.getData(nextProps.categoryId);
	}
	// 获取数据
	getData(categoryId = this.props.categoryId){
		this.setState({
			loading: true
		});
		getCategory({
			categoryId
		}).then(res => {
			const dataSource = res.data;
			// 将key放入list
			dataSource.map((item, index) => {
				item.key = index + 1;
			});
			this.setState({
				dataSource,
				loading: false,
				hasError: false
			})
		}).catch(e => {
			console.error(e);
			this.setState({
				loading: false,
				hasError: e
			});
		});
	}
	// 修改名称
	changeNameHandle(record){
		let newName = prompt('请输入新的名称', record.name);
		if(newName){
			editCategory({
				categoryId: record.id,
				categoryName: newName
			}).then(res => {
				message.info(res.data);
				this.getData();
			}).catch(e => {
				console.log(e);
			})
		}
	}
}

export default List;
