import * as actionTypes from '../constants/userInfo';

// 登录
export function login(data){
	return {
		type: actionTypes.USERINFO_LOGIN,
		data
	};
};

// 更新
export function update(data){
	return {
		type: actionTypes.USERINFO_UPDATE,
		data
	};
};

// 退出登录
export function loginOut(data){
	return {
		type: actionTypes.USERINFO_LOGINOUT,
		data
	};
};
