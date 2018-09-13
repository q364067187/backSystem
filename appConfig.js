// 公用代理
var proxyCommon = [
	{
		server: '/v1/upload',
		target: 'https://upload.yunbay.com'
	}, {
		server: '/backend',
		target: 'https://product.yunbay.com'
	}
];

const appConfig = {
	normalRestPath: '/v1',
	restPath: '/backend',

	// 开发端口
	portDev: 1001,

	// 生产端口
	portPro: 8001,

	// 开发代理
	proxyDev: proxyCommon,

	// 生产代理
	proxyPro: proxyCommon,
};

module.exports = appConfig;
