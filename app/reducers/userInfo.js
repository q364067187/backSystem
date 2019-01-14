import * as actionTypes from "../constants/userInfo";

const initialState = {};

export default function userInfo(state = initialState, action){
	switch(action.type){
		// 登录
		case actionTypes.USERINFO_LOGIN:
			return action.data;

		// 修改信息
		case actionTypes.USERINFO_UPDATE:
			return action.data;

		default:
			return state;
	}
};
