import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Title from 'APP/components/Title';

import List from './subpage/list';

class User extends React.Component {
	constructor(props, context) {
	    super(props, context);
	    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
	    return (
            <div>
            	<Title title="用户列表" />
				<List />
            </div>
	    )
	}
}

export default User;
