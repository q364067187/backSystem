import { fet } from './';
import routeGroup from './routeGroup';

// 数据
export function getList(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.listUser,
        formData: true,
        params: obj
    });
    return result;
};
