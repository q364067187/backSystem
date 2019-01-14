import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { message, Button } from 'antd';

import Title       from 'APP/components/Title';
import DataLoad    from 'APP/components/DataLoad';
import { getInfo } from 'APP/fetch/order.js';

import Form from './subpage/form';
import './index.less';

class ProductDetail extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
	        loading: true,
	        hasError: false,
	        data: null
	    };
	}
	render() {
        const { data } = this.state;
		return (
			<div>
                <Title title='订单详情' />
                <Button onClick={this.backHandle.bind(this)} className="m-add-btn" size="large" type="primary" icon="left">返回</Button>
				<DataLoad {...this.state} errorCallback={this.getData.bind(this)}>
                    <Form data={data} getData={this.getData.bind(this)} />
                </DataLoad>
			</div>
		);
	}
	backHandle(){
	    this.props.history.push('/order/index');
	}
	componentDidMount() {
        this.getData();
    }
    // 读取id数据
    getData(){
        const orderNo = this.props.match.params.id;
        this.setState({
            loading: true
        });
        getInfo({
            orderNo
        }).then(res => {
            const data = res.data;
            this.setState({
                data,
                loading: false,
                hasError: false
            });
        }).catch(e => {
            console.log(e);
            this.setState({
                loading: false,
                hasError: e
            });
        });
    }
}

export default ProductDetail;
