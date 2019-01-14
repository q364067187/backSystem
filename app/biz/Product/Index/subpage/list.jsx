import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router-dom';
import { Divider, Button, Modal, message } from 'antd';
const confirm = Modal.confirm;

import DataTable                   from 'APP/components/DataTable';
import { getTime }                 from 'APP/config/pageApi';
import { getList, postSetProduct } from 'APP/fetch/product';

class List extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
			searchParams: this.props.searchParams,
			loading    : true,
			hasError   : false,
			dataSource : [],
			pagination: {
				current: 1,
				pageSize: 10
			},
	    };
	}
	render() {
		const columns = [
			{
				title: '序号',
				dataIndex: 'key',
				align: 'center',
			}, {
				title: '商品ID',
				dataIndex: 'id',
				align: 'center',
			}, {
				title: '商品信息',
				dataIndex: 'name',
				align: 'left',
				width: '30%',
				render: (text, record) => (
					<div>
						<p>{record.name}</p>
						<p>{record.subtitle}</p>
					</div>
				)
			}, {
				title: '价格',
				dataIndex: 'price',
				align: 'center',
				render: text => { return '￥' + text }
			}, {
				title: '状态',
				dataIndex: 'status',
				align: 'center',
				render: (text, record) => (
					<div>
						<span>{text == 1 ? '在售' : '已下架'}</span>
						<Button style={{'marginLeft': '10px'}} onClick={this.setProductHandle.bind(this, record)}>
							{text == 1 ? '下架' : '上架'}
						</Button>
					</div>
				)
			}, {
				title: '操作',
				dataIndex: 'id',
				key: 'operate',
				align: 'center',
				render: (text, record) => (
					<div>
						<Link className="u-impor" to={`/product/detail/${text}`}>详情</Link>
						<Divider type="vertical" />
						<Link className="u-impor" to={`/product/save/${text}`}>编辑</Link>
					</div>
				)
			}
		];
	    return (
			<DataTable {...this.state} columns={columns} getData={this.getData.bind(this)} onChange={this.tableChangeHandle.bind(this)} />
	    );
	}
	componentWillMount() {
		this.getData();
	}
	// 当主页面更换搜索条件，刷新数据
	componentWillReceiveProps(nextProps) {
		if(this.props.refresh === nextProps.refresh) return;
		const pagination = this.state.pagination;
		pagination.current = 1;
		this.setState({
			searchParams: nextProps.searchParams,
			pagination
		}, () => {
			this.getData();
		});
	}
	// 获取数据
	getData(params){
		const { searchParams, pagination } = this.state;
		const paramsPage = {
			pageNum  : pagination.current,			// 第几页(默认第1页)
			pageSize : pagination.pageSize,   		// 页大小(默认10)
		};
		params = Object.assign(searchParams, paramsPage, params);

		this.setState({
			loading: true
		});
		getList(params).then(res => {
			const data = res.data;
			const dataSource = data.list;
			const page = params.pageNum;
			const page_size = params.pageSize;
			// 将key放入list
			dataSource.map((item, index) => {
				item.key = page_size * (page - 1) + (index + 1);
			});
			pagination.total = data.total;
			pagination.pageSize = page_size;
			pagination.current = page;
			this.setState({
				dataSource,
				pagination,
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
	// 表格数据切换
	tableChangeHandle(pagination, filters, sorter){
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({
			pagination: pager
		}, () => {
			this.getData();
		});
	}
	// 上下架操作
	setProductHandle(record){
		let newStatus = record.status == 1 ? 2 : 1;
		let name = record.status == 1 ? '下架' : '上架';
		confirm({
			title: '是否确认' + name + 'id为' + record.id + '的商品？',
			cancelText: "取消",
			okText: "确定",
			onOk: () => {
				return postSetProduct({
					productId : record.id,
					status    : newStatus
				}).then(res => {
					message.success('操作成功！');
					// 更新数据
					this.getData();
				}).catch((e) => {
					console.log(e);
				});
			}
		});
	}
}

export default List;
