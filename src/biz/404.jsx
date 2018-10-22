import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Title    from 'SRC/component/Title';
import NetError from 'SRC/component/NetError';

class Notfound extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
	    return (
            <div>
            	<Title title="找不到页面" />
            	<NetError type={["404"]}/>
            </div>
	    )
	}
}

export default Notfound;
