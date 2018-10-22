import { fet } from './';

// 数据
export function getList(obj) {
    obj = obj || {};
    const result = fet({
        type: 'post',
        url: restPath + '/user/list.do',
        params: obj
    });
    return result;
};
