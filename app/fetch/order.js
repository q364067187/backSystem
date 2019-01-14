import { fet } from './';
import routeGroup from './routeGroup';

// 列表
export function getList(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.listOrder,
        formData: true,
        params: obj
    });
    return result;
};

// 搜索
export function getSearch(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.searchOrder,
        formData: true,
        params: obj
    });
    return result;
};


// 获取订单详情
export function getInfo(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.infoOrder,
        formData: true,
        params: obj
    });
    return result;
};


// 订单发货
export function sendOrder(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.sendOrder,
        formData: true,
        params: obj
    });
    return result;
};
