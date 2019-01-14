import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router-dom';
import { Divider, Button, Modal, message } from 'antd';

import DataTable              from 'APP/components/DataTable';
import { getTime }            from 'APP/config/pageApi';
import { getList, getSearch } from 'APP/fetch/order';

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
			perPage: [10, 20, 30, 50, 100, 200, 300, 500, 1000, 10000],
	    };
	}
	render() {
		const columns = [
			{
				title: '序号',
				dataIndex: 'key',
				align: 'center',
			}, {
				title: '订单号',
				dataIndex: 'orderNo',
				align: 'center',
			}, {
				title: '收件人',
				dataIndex: 'receiverName',
				align: 'center',
				render: text => text || '无'
			}, {
				title: '订单状态',
				dataIndex: 'statusDesc',
				align: 'center',
			}, {
				title: '订单总价',
				dataIndex: 'payment',
				align: 'center',
				render: text => { return '￥' + text }
			}, {
				title: '创建时间',
				dataIndex: 'createTime',
				align: 'center',
			}, {
				title: '操作',
				dataIndex: 'orderNo',
				key: 'operate',
				align: 'center',
				render: (text, record) => (
					<div>
						<Link className="u-impor" to={`/order/detail/${text}`}>详情</Link>
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

		const fetchMethod = !!params.orderNo ? getSearch : getList;

		this.setState({
			loading: true
		});
		fetchMethod(params).then(res => {
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
			console.log(e);
			if(e.msg === "订单不存在"){
				pagination.total = 0;
				this.setState({
					dataSource: [],
					loading: false,
					hasError: false
				});
			}else{
				this.setState({
					loading: false,
					hasError: e
				});
			}
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
}

export default List;
