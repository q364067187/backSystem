import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Title from 'SRC/component/Title';
import List from './list';

class Home extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	    this.state = {
	    	title: "标题"
	    };
	}
	render() {
	    return (
            <div>
            	<Title title="首页" />
            	<List title={this.state.title} />
            	<button onClick={this.clickHandle.bind(this)}>换title</button>
            </div>
	    )
	}
	clickHandle(){
		this.setState({
			title: '换了标题'
		});
	}
}

export default Home;
