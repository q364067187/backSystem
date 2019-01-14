import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { message, Button } from 'antd';

import Title       from 'APP/components/Title';
import DataLoad    from 'APP/components/DataLoad';
import { getInfo } from 'APP/fetch/product.js';

import Form from './subpage/form';

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
                <Title title='商品详情' />
                <Button onClick={this.backHandle.bind(this)} className="m-add-btn" size="large" type="primary" icon="left">返回</Button>
				<DataLoad {...this.state} errorCallback={this.getData.bind(this)}>
                    <Form data={data} />
                </DataLoad>
			</div>
		);
	}
	backHandle(){
	    this.props.history.push('/product/index');
	}
	componentDidMount() {
        const id = this.props.match.params.id;
        this.getData(id);
    }
    // 读取id数据
    getData(productId){
        this.setState({
            loading: true
        });
        getInfo({
            productId
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
