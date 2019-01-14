// 上传参数
const UPLOADCONFIG = {
	url: APPCONFIG.restPath + '/product/upload.do',
	// 参数名
	name: 'upload_file',
	// 传文件type
	diyType: false,
	// 上传前对文件的处理
	beforeSolveFile({ file }){
		return new Promise((resolve, reject) => {
			resolve();
		});
	},
	// 判断接口返回的成功条件
	isResSucuess(res){
		return res.status === 0;
	},
	// 处理成功后的返回体
	// result: 图片对象
	solveSuccessData({ result, data }){
		result.url = data.url;
		result.uri = data.uri;
	},
	// 富文本编辑器的处理
	richEditorCallback({ param, data }){
		param.success({
			url: data.url,
			meta: {
				id       : param.libraryId,
				title    : param.file.name,
				alt      : param.file.name,
				loop     : true, 				// 指定音视频是否循环播放
				autoPlay : true, 				// 指定音视频是否自动播放
				controls : true, 				// 指定音视频是否显示控制栏
				// poster: 'http://xxx/xx.png', // 指定视频播放器的封面
			}
		});
	},
	// 错误信息
	errMsg(res){
		return res.data || '上传失败'
	},
	// 获取请求头
	getHeaders({ file }){
		return {};
	}
};

module.exports = UPLOADCONFIG;
