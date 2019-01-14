import { fet } from './';
import routeGroup from './routeGroup';

// 列表
export function getList(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.searchProduct,
        formData: true,
        params: obj
    });
    return result;
};

// 详情
export function getInfo(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.infoProduct,
        formData: true,
        params: obj
    });
    return result;
};

// 新增或编辑
export function postForm(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.saveProduct,
        formData: true,
        params: obj
    });
    return result;
};

// 上下架
export function postSetProduct(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.setProduct,
        formData: true,
        params: obj
    });
    return result;
};

// 获取品类
export function getCategory(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.listCategory,
        formData: true,
        params: obj
    });
    return result;
};

// 修改品类名称
export function editCategory(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.editCategory,
        formData: true,
        params: obj
    });
    return result;
};

// 添加新节点
export function addCategory(obj = {}) {
    const result = fet({
        type: 'post',
        url: routeGroup.addCategory,
        formData: true,
        params: obj
    });
    return result;
};
