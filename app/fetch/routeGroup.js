window.restPath = APPCONFIG.restPath;

export default {
	// 商品
	listProduct   : restPath + '/product/list.do',
	searchProduct : restPath + '/product/search.do',
	setProduct    : restPath + '/product/set_sale_status.do',
	infoProduct   : restPath + '/product/detail.do',
	saveProduct   : restPath + '/product/save.do',

	// 品类
	listCategory : restPath + '/category/get_category.do',
	editCategory : restPath + '/category/set_category_name.do',
	addCategory  : restPath + '/category/add_category.do',

	// 用户
	listUser: restPath + '/user/list.do',

	// 订单
	listOrder   : restPath + '/order/list.do',
	searchOrder : restPath + '/order/search.do',
	infoOrder   : restPath + '/order/detail.do',
	sendOrder   : restPath + '/order/send_goods.do',

	// 登录
	login: restPath + '/user/login.do',

	// 首页
	home: restPath + '/statistic/base_count.do',
};
