import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Table, Select } from 'antd';
const Option = Select.Option;

import NetError from '../NetError';

import './index.less';

class DataTable extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const { loading, hasError, pagination, getData } = this.props;
		const perPage = this.props.perPage || [10, 20, 30, 50, 100];

		const tableDemo = (
			<div className="m-dataTable">
				{
					pagination && pagination.total
					? <div className="u-table-top">
						<div className="u-perPage">
							每页
							<Select className="u-slt" defaultValue={pagination.pageSize || perPage[0]} onChange={this.perPageChange.bind(this)}>
								{
									perPage.map((item, index) => {
										return <Option value={item} key={index}>{item}</Option>
									})
								}
						    </Select>
						    条
						    {
						    	pagination.total
						    	? <span>
						    	，共 <span className="u-impor">{pagination.total}</span> 条，<span className="u-impor">{Math.ceil(pagination.total / pagination.pageSize)}</span> 页
						    	</span>
						    	: ''
						    }
					    </div>
				    </div>
				    : ''
				}
				<Table {...this.props} bordered size="small" />
			</div>
		);

		return loading
		? tableDemo
		: hasError
			? <NetError type={hasError} errorCallback={getData} />
			: tableDemo
	}
	// 切换每页
	perPageChange(value){
		setTimeout(() => {
			this.props.getData({
				page_size: value,
				page: 1
			});
		}, 300);
	}
}

export default DataTable;
