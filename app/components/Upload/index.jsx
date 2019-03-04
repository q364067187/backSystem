import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Upload, Icon, Modal, message, Button } from 'antd';

import './index.less';

class UploadComponent extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.state = {
			previewVisible: false,
			previewImage: '',
			previewAlt: '',
			fileList: this.props.fileList || []
		};
	}
	render() {
		const { previewVisible, previewImage, previewAlt, fileList } = this.state;
		let {
			disabled,
			className = '',
			size = 'normal',
			promptText = "",
			maxLength = 1,
			uploadText = "上传",
			// 当上传文件到达最大时，是否隐藏上传按钮，默认true
			maxHideButton = true,
			// 上传限制，默认为图片类型
			accept = "image/gif, image/jpeg, image/pjpeg, image/jpg, image/png, image/x-png, image/bmp",
			listType = "picture-card"
		} = this.props;

		const uploadButton = listType === 'text' ? (
			<Button disabled={disabled}>
		    	<Icon type="upload" /> {uploadText}
		    </Button>
		) : (
			<div className="u-picture-card">
				<Icon type="plus" />
				<div className="u-text-main">{uploadText}</div>
				<div className="u-text-prompt">{promptText}</div>
			</div>
		);

		return (
			<div className={`m-upload-module s-${size} ${className}`}>
				<Upload
					customRequest={this.customRequestHandle.bind(this)}
					accept={accept}
					listType={listType}
					fileList={fileList}
					beforeUpload={this.beforeUploadHandle.bind(this)}
					onPreview={this.previewHandle.bind(this)}
					onChange={this.changeHandle.bind(this)}
					disabled={disabled}
					>
					{
						maxHideButton
						? fileList.length >= maxLength ? null : uploadButton
						: uploadButton
					}
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.cancelHandle.bind(this)}>
					<img alt={previewAlt} style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		);
	}
	// 当上级变化fileList，同步更新state
	componentWillReceiveProps(nextProps) {
		const fileList = nextProps.fileList;
		// 当上级fileList元素和控件state的fileList元素一致时，不做操作
		if(fileList.equals(this.state.fileList)) return;
		this.setState({
			fileList
		});
	}
	// 通过覆盖默认的上传行为，可以自定义自己的上传实现
	customRequestHandle(obj){
		const xhr = new XMLHttpRequest;
		const fd = new FormData();
		const file = obj.file;

		const successFn = (response) => {
			// 假设服务端直接返回文件上传后的地址
			const responseJson = JSON.parse(xhr.responseText);
			obj.onSuccess(responseJson);
		};
		const progressFn = (event) => {
			// 上传进度发生变化时
			obj.onProgress({
				percent: event.loaded / event.total * 100
			});
		};
		const errorFn = (response) => {
			// 上传发生错误时
			obj.onError();
		};

		xhr.upload.addEventListener("progress", progressFn, false);
		xhr.addEventListener("load", successFn, false);
		xhr.addEventListener("error", errorFn, false);
		xhr.addEventListener("abort", errorFn, false);

		if(UPLOADCONFIG.diyType){
			// 要传type时
			// 对ipa和apk后缀做type处理
			let nameArr = file.name.split('.');
			let name = nameArr && nameArr[nameArr.length - 1];
			let type = file.type;
			switch(name){
				case 'ipa':
					type = 'application/vnd.iphone';
					break;
				case 'apk':
					type = 'application/vnd.android.package-archive';
					break;
			}
			let blob = new Blob([file], { type });
			fd.append(UPLOADCONFIG.name, blob);
		}else{
			fd.append(UPLOADCONFIG.name, file);
		}

		xhr.open('POST', UPLOADCONFIG.url, true);
		// 头部设置
		let headers = UPLOADCONFIG.getHeaders({ file });
		for(let i in headers){
			xhr.setRequestHeader(i, headers[i]);
		}
		xhr.send(fd);
	}
	// 上传文件之前的处理
	beforeUploadHandle(file, fileList){
		return new Promise((resolve, reject) => {
			// 转换文件流
			let fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			// 给文件的缩略图设为base64值
			fileReader.onload = theFile => {
				const result = theFile.target.result;
				file.thumbUrl = result;
				// 执行上传配置中的上传前文件配置方法
				UPLOADCONFIG.beforeSolveFile({ file }).then(res => {
					resolve();
				});
			}
		});
	}
	// 文件状态改变的回调 上传中、完成、失败都会调用这个函数。
	changeHandle(obj){
		// fileList处理
		console.log('获取fileList', obj.fileList);

		// 超过最大上传数时，把最先上传的删除
		let fileList = obj.fileList.slice(-this.props.maxLength);
		let file = obj.file;

		fileList = fileList.map((item, index) => {
			const { response } = item;
			let result = Object.assign({}, item);
			// 处理服务端返回数据
			if(response){
				// 成功处理
				if(UPLOADCONFIG.isResSucuess(response)){
					// 处理成功后的返回体
					UPLOADCONFIG.solveSuccessData({ result, data: response.data });
				}else{
					// 错误处理
					message.error(UPLOADCONFIG.errMsg(response));
				}
			}
			// 当父级需要设置：url为name
			if(this.props.urlIsName){
				result.name = result.url;
			}
			return result;
		});
		console.log('改造后fileList', fileList);

		// 监控当前file(而不是fileList)是否上传成功
		let isSuccess = file.status === 'done' && UPLOADCONFIG.isResSucuess(file.response);

		this.setState({
			fileList
		}, () => {
			// 上传成功了，才对上级页面进行传值
			if(isSuccess){
				this.props.getUploadUrl(fileList);
			}
		});
	}
	// 预览图片弹层
	previewHandle(file) {
		// 如果父级未定义是否查看弹层图片预览，默认true
		const { showPreview = true } = this.props;
		if(showPreview){
			this.setState({
				previewImage: file.thumbUrl || file.url,
				previewVisible: true,
				previewAlt: file.name
			});
		}
	}
	// 关闭预览弹层
	cancelHandle() {
		this.setState({
			previewVisible: false
		});
	}
}

export default UploadComponent;
