import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Table } from 'antd';

import { getTime } from 'SRC/config/pageApi';
import { getList } from 'SRC/fetch/user';
import NetError    from 'SRC/component/NetError';

class Notfound extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
			page       : 1,
			page_size  : 10,
			hasError   : false,
			dataSource : [],
			pagination : {},
			loading    : true,
	    };
	}
	render() {
		const { hasError } = this.state;
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
            <div>
            	{
	            	hasError
					? <NetError type={hasError} />
					: <Table {...this.state} bordered size="small" onChange={this.tableChangeHandle.bind(this)} columns={columns} />
            	}
            </div>
	    )
	}
	componentWillMount() {
		this.getData();
	}
	// 获取数据
	getData(){
		this.setState({
			loading: true
		});
		const params = {
			pageNum  : this.state.page,        // 第几页(默认第1页)
			pageSize : this.state.page_size,   // 页大小(默认10)
		};
		getList(params).then(res => {
			const data = res.data;
			const dataSource = data.list;
			const pagination = this.state.pagination;
			pagination.total = data.total;
			// 将key放入list
			dataSource.map((item, index) => {
				item.key = 10 * (this.state.page - 1) + (index + 1);
				return item;
			});
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
			pagination: pager,
			page_size: pagination.pageSize,
			page: pagination.current
		}, () => {
			this.getData();
		});
	}
}

export default Notfound;
