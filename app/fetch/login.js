import { fet } from './';
import routeGroup from './routeGroup';

// 登录
export function postLogin(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.login,
        formData: true,
        params: obj
    });
    return result;
};
