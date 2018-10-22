// 公用代理
var proxyCommon = [
	{
		server: '/manage',
		target: 'http://admintest.happymmall.com'
	}
];

const appConfig = {
	restPath: '/manage',

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
