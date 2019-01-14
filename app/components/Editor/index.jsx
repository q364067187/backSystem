import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { message } from 'antd';

// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

import './index.less';

class Editor extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.state = {
			context: this.props.context
		};
	}
	render() {
		const { context, height = 500, contextId = 0 } = this.props;
		const editorProps = {
			height,
			contentFormat  : 'html',
			contentId      : contextId,
			initialContent : context,
			onChange       : this.changeHandle.bind(this),
			onRawChange    : this.rawChangeHandle.bind(this),
			media: {
				uploadFn: this.upload
			}
		};
		return (
			<BraftEditor {...editorProps}/>
		);
	}
	// 内容变化回调
	changeHandle(context) {
		// 当变化的数值和之前无变化时，不执行接下来的操作
		if(context === this.state.context) return;
		this.props.cbReceiver(context);
		this.setState({
			context
		});
	}
	rawChangeHandle(rawContent) {
		// console.log(rawContent);
	}
	// 上传回调
	upload(param){
		const xhr = new XMLHttpRequest;
		const fd = new FormData();

		console.log(param);

		const errorFn = (response) => {
			let errorMsg = '上传失败。';
			if(xhr.responseText !== ''){
				// 只有当返回的是json字符串时，才处理错误信息
				const res = JSON.parse(xhr.responseText);
				errorMsg = UPLOADCONFIG.errMsg(res);
			}

			message.error(errorMsg);
			// 上传发生错误时调用param.error
			param.error({
				msg: errorMsg
			});
		}
		const successFn = (response) => {
			// 假设服务端直接返回文件上传后的地址
			// 上传成功后调用param.success并传入上传后的文件地址
			const res = JSON.parse(xhr.responseText);
			if(UPLOADCONFIG.isResSucuess(res)){
				const data = res.data;
				UPLOADCONFIG.richEditorCallback({ param, data });
			}else {
				errorFn(response);
			}
		}
		const progressFn = (event) => {
			// 上传进度发生变化时调用param.progress
			param.progress(event.loaded / event.total * 100);
		}

		xhr.upload.addEventListener("progress", progressFn, false);
		xhr.addEventListener("load", successFn, false);
		xhr.addEventListener("error", errorFn, false);
		xhr.addEventListener("abort", errorFn, false);

		fd.append(UPLOADCONFIG.name, param.file);
		xhr.open('POST', UPLOADCONFIG.url, true);
		// 头部设置
		let headers = UPLOADCONFIG.getHeaders({ file: param.file });
		for(let i in headers){
			xhr.setRequestHeader(i, headers[i]);
		}
		xhr.send(fd);
	}
}

export default Editor;
