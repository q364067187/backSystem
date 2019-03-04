import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Select } from 'antd';
const Option = Select.Option;

class DataSelect extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const { data, loading, hasError, chooseText, loadingText, errorText, emptyText, errorCallback, nameFormat = name => name } = this.props;
		return (
			<Select
				{...this.props}
				>
				{
					loading
					? <Option value="">{loadingText || '正在加载...'}</Option>
					: hasError
						? <Option value="">{errorText || '获取失败'}，<a href="javascript:" className="u-impor" onClick={errorCallback}>重试</a></Option>
						: data && data.length
							? [
								<Option value="" key="choose">{chooseText || '请选择'}</Option>,
								this.props.children || '',
								data.map((item, index) => <Option key={index} value={item.value}>{nameFormat(item.name)}</Option>)
							]
							: <Option value="">{emptyText || "无数据"}</Option>
				}
			</Select>
		);
	}
}

export default DataSelect;
