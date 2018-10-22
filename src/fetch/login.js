import { fet } from './';

// 登录
export function postLogin(obj) {
    obj = obj || {};
    const result = fet({
        type: 'post',
        url: restPath + '/user/login.do',
        params: obj
    });
    return result;
};
