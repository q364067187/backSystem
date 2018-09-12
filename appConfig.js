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
	portDev: 1235,

	// 测试端口
	portTest: 8080,

	// 生产端口
	portPro: 8080,

	// 开发代理
	proxyDev: proxyCommon,

	// 测试代理
	proxyTest: proxyCommon,

	// 生产代理
	proxyPro: proxyCommon,

	// Web端文章url - 开发
	articleLinkWebDev: 'http://localhost:1234/article/detail?id=',

	// Web端文章url - 测试
	articleLinkWebTest: 'http://172.17.10.10/article/detail?id=',

	// Web端文章url - 生产
	articleLinkWebPro: 'https://www.yunbay.com/article/detail?id='
};

module.exports = appConfig;
