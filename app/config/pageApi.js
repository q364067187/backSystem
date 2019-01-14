import { USERNAME } from "./StoreKey";

// 一些公用方法

// 统一的列表获取时间
export function getTime(time){
	var result;
	if(time === 0 || time == null){
		result = '---';
	}else{
		result = JSAPI.dateFormat(new Date(time), 'yyyy-MM-dd hh:mm:ss');
	}
	return result;
};

// 统一的年月日时间处理 一般用于传接口
export function setTime(time){
	return JSAPI.dateFormat(new Date(time), 'yyyy-MM-dd');
};

// 删除对象中为空或者null的属性
export function delEmptyPar(obj){
	if(typeof obj !== 'object') return;
	for(let i in obj){
		if(obj[i] == null || obj[i] === ''){
			delete obj[i];
		}else if(typeof obj[i] === 'string'){
			obj[i] = obj[i].trim();
		}
	}
};

// 未登录获取路由方便登录后跳转
export function getRedirect(){
	return location.hash && "?redirect=" + encodeURIComponent(location.hash.replace(/#/, '') || '/');
};

// 登录保存cookie及redux
// data 用户信息对象
export function saveLogin(data, props){
	const username = data['username'];
	// 存cookie
	JSAPI.setCookie({
	    [USERNAME]: {
	        value: username
	    }
	});

	// 存redux
	if(props){
		const userInfo = props.userInfo;
		userInfo.username = username;
		props.userInfoActions.login(userInfo);
	}
};

// 登录后获取cookie更新redux
export function updateLogin(props){
	const username = JSAPI.getCookie(USERNAME);

	if(props){
		const userInfo = props.userInfo;
		userInfo.username = username;

		// 存redux
	    props.userInfoActions.update(userInfo);
	}
};

// 登录后跳转
export function goAfterLogin(props){
	// 如果没记录跳转回的链接，默认跳member页
	const router = decodeURIComponent(JSAPI.getQuery('redirect') || '/');
	props.history.replace(router);
};

// 判断是否登录
export function isLogin(){
	const token = JSAPI.getCookie(USERNAME);
	return !!token;
};

// 判断如果登录了，跳转到首页
export function loginJump(props, callback){
	if(isLogin()){
		goAfterLogin(props);
    	return;
	}
	if(callback instanceof Function){
		callback();
	}
};

// 模块需要登录，跳登录页
export function needLogin(props, callback){
	if(!isLogin()){
    	const redirect = getRedirect();
    	props.history.replace('/login' + redirect);
    	return;
	}
	if(callback instanceof Function){
		callback();
	}
};

// 退出登录
export function loginOut(props){
	// 删除cookies
	JSAPI.deleteCookie([USERNAME]);
	if(props){
		// 主动退出登录，不需要存储登录后跳转
		// 更新redux
		props.userInfoActions.update({});
		props.history.replace('/login');
	}else{
		goLogin();
	}
};

// 强制跳登录，带上当前链接方便登录后跳回。只适用于非路由内模块
export function goLogin(){
    const redirect = getRedirect();
	location.hash = '#/login' + redirect;
};
