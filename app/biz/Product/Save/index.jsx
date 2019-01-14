import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { message, Button } from 'antd';

import Title       from 'APP/components/Title';
import DataLoad    from 'APP/components/DataLoad';
import { getInfo } from 'APP/fetch/product.js';

import Form from './subpage/form';

class Save extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
	        type: this.props.match.params.id == null ? 'add' : 'edit',
	        loading: true,
	        hasError: false,
	        data: null
	    };
	}
	render() {
        const { type, data } = this.state;
        const name = type === 'add' ? '添加商品' : '编辑商品';
        const id = this.props.match.params.id;
		return (
			<div>
                <Title title={name} />
                <Button onClick={this.backHandle.bind(this)} className="m-add-btn" size="large" type="primary" icon="left">返回</Button>
                {
                    type === 'edit'
                    ? <DataLoad {...this.state} errorCallback={this.getData.bind(this)}>
                        <Form submitSuccess={this.submitSuccess.bind(this)} data={data} id={id} type={type} />
                    </DataLoad>
                    : <Form submitSuccess={this.submitSuccess.bind(this)} type={type} />
                }
			</div>
		);
	}
	backHandle(){
	    this.props.history.push('/product/index');
	}
	componentDidMount() {
        // 编辑情况下，调用接口获取数据
        if(this.state.type === 'edit'){
            const id = this.props.match.params.id;
            this.getData(id);
        }
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
    // 成功提交后回调
    submitSuccess() {
        message.success('提交成功！');
        setTimeout(() => {
            this.backHandle();
        }, 100);
    }
}

export default Save;
