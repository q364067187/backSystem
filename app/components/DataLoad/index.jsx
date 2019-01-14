import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Loading  from '../Loading';
import NetError from '../NetError';
import NoResult from '../NoResult';

class DataLoad extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const { loading, hasError, data, loadingText, emptyText, errorText, display, errorCallback } = this.props;
		return loading
			? <Loading display={display} loadingText={loadingText} />
			: hasError
				? <NetError display={display} errorText={errorText} type={hasError} errorCallback={errorCallback} />
				: data
					? this.props.children || ''
					: <NoResult display={display} title={emptyText} />
	}
}

export default DataLoad;
