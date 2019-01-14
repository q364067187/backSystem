// 配置

// 公用代理
const proxyCommon = [
	{
		server: '/manage',
		target: 'http://admintest.happymmall.com'
	}
];

const restPath = '/manage';

const appConfig = {
	restPath,

	// token cookie保存天数
	tokenDay: 1,

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
