import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import DataTable   from 'APP/components/DataTable';
import { getTime } from 'APP/config/pageApi';
import { getList } from 'APP/fetch/user';

class List extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
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
				title: 'ID',
				dataIndex: 'id',
				align: 'center',
			}, {
				title: '用户名',
				dataIndex: 'username',
				align: 'center',
			}, {
				title: '邮箱',
				dataIndex: 'email',
				align: 'center',
				render: text => { return text || '---' }
			}, {
				title: '电话',
				dataIndex: 'phone',
				align: 'center',
			}, {
				title: '注册时间',
				dataIndex: 'createTime',
				align: 'center',
				render: text => { return getTime(text) }
			}
		];
	    return (
			<DataTable {...this.state} columns={columns} getData={this.getData.bind(this)} onChange={this.tableChangeHandle.bind(this)} />
	    );
	}
	componentWillMount() {
		this.getData();
	}
	// 获取数据
	getData(params){
		const { pagination } = this.state;
		const paramsPage = {
			pageNum  : pagination.current,			// 第几页(默认第1页)
			pageSize : pagination.pageSize,   		// 页大小(默认10)
		};
		params = Object.assign(paramsPage, params);

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
}

export default List;
