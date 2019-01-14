// fetch配置
import { message } from 'antd';

import { loginOut }    from 'APP/config/pageApi';

// 得到header
// appid:   api的appid
const getHeader = (
	{
		formData,
		headers = {}
	}
	) => {
	// 公共头
	const headersCommon = {
		'Content-Type': formData ? 'application/x-www-form-urlencoded' : "application/json"
	};

	// 将参数中头合并到公用头
	const headersOpt = Object.assign(headers, headersCommon);

	return headersOpt;
};

const CONFIG = {
	credentials: 'include',
	// 处理成功返回json
	solveSuccess({ json }){
		return new Promise((resolve, reject) => {
			if(json.status === 0){
				// 请求成功，返回json，走then
				resolve(json);
			}else{
				if(json.status === 10){
					// 未登录，跳登录页
		            loginOut();
				}
				// 如果不ok，提示错误信息，走catch，返回reason代码
				message.error(json.msg);
				reject(json);
			}
		});
	}
};

export {
	getHeader,
	CONFIG
};
