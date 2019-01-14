import { fet } from './';
import routeGroup from './routeGroup';

// 获取是否在线，因为接口作者没开发，用产品列表接口顶包
export function getOnline(obj ={}) {
    const result = fet({
        type: 'post',
        url: routeGroup.listProduct,
        formData: true,
        params: obj
    });
    return result;
};
