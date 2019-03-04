import 'whatwg-fetch';
import 'es6-promise';
import { message } from 'antd';

import { CONFIG, getHeader } from './config.js';

// 将对象拼接成 key1=val1&key2=val2&key3=val3 的字符串形式
function obj2params(obj) {
	let result = '', item;
	for (item in obj) {
		result += '&' + item + '=' + encodeURIComponent(obj[item]);
	}
	if (result) {
		result = result.slice(1);
	}

	return result;
}

// url:     	api路径
// type:    	get或post等 默认get
// data:    	直接传的参数，不需要处理
// params:  	参数，将根据get或post进行处理
// timeout: 	超时时间 默认20秒
// formData: 	是否formData方式传值
export function fet(obj) {
	let {
		type = 'get',
		timeout = 20000,
		formData = false,
		url, params, data, headers
	} = obj;

	let method = type.toUpperCase();
	let query  = '', body, timer;

	if(data){
		// 如果有直接传的参数，则给body直接赋值
		body = data;
	}else{
		// 对params参数进行处理
		if(method === 'GET'){
			// 参数序列化
			query = [];
			if(params != null && Object.keys(params).length > 0){
				let pt = url.match(/[?]/) ? '&' : '?';
				for(let i in params){
					query.push(i + '=' + params[i]);
				}
				query = pt + query.join('&');
			}
		}else if(method === 'POST'){
			if(formData){
				body = obj2params(params);
			}else{
				body = JSON.stringify(params);
			}
		}
	}

	let headersOpt = getHeader(obj);

	let result = fetch(url + query, {
		method,
		credentials : CONFIG.credentials,
		headers : new Headers(headersOpt),
		body
	});

	// fetch promise
	const fetchRequestPromise = new Promise((resolve, reject) => {
		result.then(res => {
			clearTimeout(timer);
			if (res.ok) {
				return res.json();
			} else {
				throw `${res.status}, ${res.statusText}`;
			}
		})
		.then(json => {
			CONFIG.solveSuccess({ json }).then(res => {
				resolve(res);
			}).catch(e => {
				reject(e);
			});
		})
		.catch(err => {
			let reason;
			// 非服务器返回原因
			if(err.constructor === TypeError){
				reason = {
					name    : err.name,					// 错误分类名
					type    : err.name,					// 错误类型
					message : err.message 				// 原错误信息
				};
				if(err.message === 'Failed to fetch'){
					reason.explain = '断网';			// 定义错误解释
					reason.tips    = '请检查您的网络';	// 显示在前台的错误信息
				}
			}else if(err.constructor === SyntaxError){
				// 语法错误
				reason = {
					name    : err.name,					// 错误分类名
					type    : err.name,					// 错误类型
					message : err.message, 				// 原错误信息
					explain : '语法错误',				// 定义错误解释
					scheme  : [
						'可能是后台返回不是json格式，导致处理出错',
					],
					tips    : '服务器错误(SyntaxError)' // 显示在前台的错误信息
				};
			}else if(typeof err === 'string'){
				// 服务器返回原因
				let errArr = err.split(', ');
				let explain, scheme, tips;
				reason = {
					name    : 'ServerError',			// 错误分类名
					type    : errArr[0],				// 错误类型
					message : errArr[1], 				// 原错误信息
				};
				switch(errArr[1]){
					case 'Bad Request':
						explain = '请求无效';
						scheme = ['检查请求参数及类型', '检查请求参数方式是否不对'];
						tips = '请求参数错误(400)';
						break;
					case 'Internal Server Error':
						explain = '服务器错误';
						scheme = ['检查接口地址是否写错', '可能是你没有传参数', '可能是后台程序BUG、中毒、配置、数据库问题，和后台人员沟通处理'];
						tips = '服务器错误(500)';
						break;
					case 'Not Found':
						explain = '接口没找到';
						scheme = ['检查接口地址是否写错', '可能是接口暂未发布'];
						tips = '服务器错误(404)';
						break;
				}
				reason.explain = explain;				// 定义错误解释
				reason.scheme  = scheme;				// 错误解决参考
				reason.tips    = tips;					// 显示在前台的错误信息
			}
			// console.log(reason);
			if(reason.tips){
				message.error(reason.tips);
			}
			reject(reason);
		});
	});

	// 如果timeoutaction先运行了就调用reject失败方法，超时
	const timerPromise = new Promise((resolve, reject) => { //resolve代表成功，reject代表失败
		timer = setTimeout(() => {
			let reason = {
				name    : 'TimeError',			// 错误分类名
				type    : 'timeout',			// 错误类型
				explain : '请求超时',			// 定义错误解释
				tips    : '连接服务器超时'		// 显示在前台的错误信息
			};
			message.error(reason.tips);
			reject(reason);
		}, timeout);
	});

	// 通过赛跑模式设置读取接口超时操作
	const resultPromise = Promise.race([
		fetchRequestPromise,    //这个是你想要调用的接口
		timerPromise            //这个是判断时间的function
	]);

	// 拦截处理
	return resultPromise;
}
