import 'whatwg-fetch';
import 'es6-promise';

import { message } from 'antd';

import { getRedirect }         from 'SRC/config/pageApi';
import { BACKTOKEN, USERNAME } from 'SRC/config/StoreKey';

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

// url:     api路径
// type:    get或post等 默认get
// data:    直接传的参数，不需要处理
// params:  参数，将根据get或post进行处理
// appid:   api的appid
// timeout: 超时时间 默认20秒
export function fet(obj) {
	let method  = (obj.type || 'get').toUpperCase();
	let url     = obj.url;
	let uri     = url;
	let params  = obj.params;
	let data    = obj.data;
	let headers = obj.headers;
	let query   = '', body;
	let timeout = obj.timeout || 20000;

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
			body = obj2params(params);
		}
	}

	let result = fetch(url + query, {
		method,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		credentials : 'include',
		body
	});


	// fetch promise
	const fetchRequestPromise = new Promise((resolve, reject) => {
		result.then(res => {
			if (res.ok) {
				return res.json();
			} else {
				throw `${res.status}, ${res.statusText}`;
			}
		})
		.then(json => {
			if(json.status === 0){
				// 请求成功，返回json，走then
				resolve(json);
			}else if(json.status === 10){
				// 未登录，跳登录页
				// 删除cookies
				JSAPI.deleteCookie([USERNAME]);
				// 指导登录后跳回原页面
				const redirect = getRedirect();
				location.hash = '#/login' + redirect;
			}else{
				// 如果不ok，提示错误信息，走catch，返回reason代码
				message.error(json.msg);
				reject(json);
			}
		})
		.catch(err => {
			let errArr = [];
			if(/,/.test(err)){
				errArr = err.split(',');
			}else{
				if(err.message === 'Failed to fetch'){
					errArr.push("断网");
					message.error('请检查您的网络');
				}else{
					errArr.push(err);
				}
			}
			console.error(errArr);
			reject(errArr);
		});
	});

	// 如果timeoutaction先运行了就调用reject失败方法，超时
	const timerPromise = new Promise((resolve, reject) => { //resolve代表成功，reject代表失败
		setTimeout(() => {
			reject(['超时']);
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
