import { fet } from './';
import routeGroup from './routeGroup';

// 数据
export function getInfo(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.home,
        formData: true,
        params: obj
    });
    return result;
};
