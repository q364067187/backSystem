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

// 未登录获取路由方便登录后跳转
export function getRedirect(){
	return location.hash && "?redirect=" + encodeURIComponent(location.hash.replace(/#/, '') || '/');
};
