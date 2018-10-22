import { fet } from './';

// 数据
export function getInfo(obj) {
    obj = obj || {};
    const result = fet({
        type: 'post',
        url: restPath + '/statistic/base_count.do',
        params: obj
    });
    return result;
};
