import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Title    from '../components/Title';
import NetError from '../components/NetError';

class Notfound extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
	    return (
            <div>
            	<Title title="找不到页面" />
            	<NetError type={{
            		explain: '404'
            	}}/>
            </div>
	    )
	}
}

export default Notfound;
