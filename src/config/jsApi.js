/*
 * @Author: liuxiaochen
 * @Date:   2017-12-19 14:13:18
 * @Last Modified by:   liuxiaochen
 * @Last Modified time: 2018-09-20 11:33:50
 */
var jsApi = {
    /**
     * [将中文字符串转换成UTF-8格式]
     * @param  {[string]} str [传入字符串]
     * @return {[string]}     [得到的字符串]
     */
    toUtf8: function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },
    /**
     * [将数字转换成中文数字]
     * @param  {[number]} num [数字]
     * @return {[string]}     [转换后的字符串]
     */
    toChinaNum: function(num){
        switch(num){
            case 0:
                return '〇';
            case 1:
                return '一';
            case 2:
                return '二';
            case 3:
                return '三';
            case 4:
                return '四';
            case 5:
                return '五';
            case 6:
                return "六";
            case 7:
                return "七";
            case 8:
                return "八";
            case 9:
                return "九";
        }
    },
    /**
     * 用于把用utf16编码的字符转换成实体字符，以供后台存储
     * @param   {string} str    [将要转换的字符串，其中含有utf16字符将被自动检出]
     * @return  {string}        [转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符]
     * 示例
        jsApi.utf16toEntities(unescape("笑脸表情%uD83D%uDE0A"));
        ==> "笑脸表情&#128522"
     */
    utf16toEntities: function(str) {
        var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
        str = str.replace(patt,
            function(char) {
                var H, L, code;
                if (char.length === 2) {
                    H = char.charCodeAt(0); // 取出高位
                    L = char.charCodeAt(1); // 取出低位
                    code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
                    return "&#" + code + ";";
                } else {
                    return char;
                }
            });
        return str;
    },
    /**
     * [字段加密]
     * 只接收一个对象obj，以下是属性说明
     * @param  {[string]} str [原字段]
     * @param  {[number]} num [中间加密几位, 默认4位]
     * @param  {[number]} sign[加密符号, 默认*]
     * @return {[string]}     [新字段]
     * 示例
        jsApi.stringEncrypt({
            str: '18888888888'
        });
        ==> 188****8888
     */
    stringEncrypt: function(obj) {
        var newStr = '',
            star = '',
            str = obj.str,
            length = str.length,
            num = obj.num || 4,
            sign = obj.sign || '*',
            reg, beforeNum, afterNum;

        beforeNum = Math.floor((length - num) / 2);
        afterNum = Math.ceil((length - num) / 2);
        reg = new RegExp('(\\d{' + beforeNum + '})\\d{' + num + '}(\\d{' + afterNum + '})');
        for (var i = 0; i < num; i++) {
            star += sign;
        }
        newStr = str.replace(reg, '$1' + star + '$2');
        return newStr;
    },
    /**
     * [复制元素的文字]
     * 只接收一个对象obj，以下是属性说明
     * @param  {[string]}   handlerID   [点击事件的元素id]
     * @param  {[string]}   textID      [复制元素id]
     * @param  {[function]} success     [成功回调方法]
     * 示例
        jsApi.copyElementText({
            handlerID: 't_copy',
            textID: 't_code',
            success: function(text){
                alert("复制成功,复制文本为" + text);
            }
        });
     */
    copyElementText: function(obj) {
        var $handler = document.getElementById(obj.handlerID),
            $text = document.getElementById(obj.textID),
            $input, value,
            isIE = this.isIE();

        function runCopyNotIE() {
            value = $text.value || $text.innerText;
            if ($text.tagName === 'INPUT' || $text.tagName === 'TEXTAREA') {
                $text.select();
                document.execCommand("Copy");
            } else {
                $input = document.createElement('input');
                $input.value = value;
                $handler.appendChild($input);
                $input.select();
                document.execCommand("Copy");
                $handler.removeChild($input);
            }
            if (obj.success instanceof Function) {
                obj.success(value);
            }
        }

        function runCopyIE() {
            value = $text.value || $text.innerText;
            window.clipboardData.setData('Text', value);
            if (obj.success instanceof Function) {
                obj.success(value);
            }
        }
        if (isIE) {
            $handler.attachEvent('onclick', runCopyIE);
        } else {
            $handler.onclick = runCopyNotIE;
        }
    },
    /**
     * [将浮点数小数点后面出现很多位bug解决]
     * @param  {[number]} float [浮点数]
     * @param  {[number]} pow   [保留几位，默认2位]
     * @return {[number]}       [处理后的浮点数]
     * 示例
        jsApi.getFloat(Math.PI);        ==> 3.14
        jsApi.getFloat(Math.PI, 5);     ==> 3.14159
     */
    getFloat: function(float, pow) {
        if (typeof float !== 'number') {
            console.error("getFloat方法只接收Number参数");
            return;
        }
        pow = pow || 2;
        return Math.round(float * Math.pow(10, pow)) / Math.pow(10, pow);
    },
    /**
     * [将字符串首位空格去除]
     * @param  {[string]} str [要去除空格的字符串]
     * @return {[string]}     [去除后的字符串]
     * 示例
        jsApi.strTrim('  test  ');      ==> "test"
     */
    strTrim: function(str) {
        str = str.replace(/(^\s*)|(\s*$)/g, "");
        return str;
    },
    /**
     * [获取随机整数]
     * @param  {[number]} m     [开始数，传整数]
     * @param  {[number]} n     [结束数，传整数]
     * @return {[number]}       [返回的开始到结束范围内的整数]
     * 示例
        jsApi.getRandom(1, 5);  ==> 3
     */
    getRandom: function(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m);
    },
    isMobile: function() {
        var a = (/Android|iphone|SymbianOS|Windows Phone|iPad|iPod|MQQBrowser/i).test(navigator.userAgent);
        return a;
    },
    isAndroid: function() {
        var a = navigator.userAgent,
            b = (navigator.appVersion, a.indexOf("Android") > -1 || a.indexOf("Linux") > -1);
        return b;
    },
    isIos: function() {
        var a = navigator.userAgent,
            b = !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        return b;
    },
    isiPhone: function() {
        var a = /iphone/i.test(navigator.userAgent);
        return a;
    },
    isiPad: function() {
        var a = /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent);
        return a;
    },
    // 微信浏览器
    isWeixin: function() {
        var a = navigator.userAgent.toLowerCase();
        return a.indexOf("micromessenger") > -1;
    },
    // QQ浏览器
    isQQ: function() {
        var a = navigator.userAgent.toLowerCase();
        return a.indexOf("qq") > -1;
    },
    // QQ内置浏览器
    isQQInner: function(){
        var a = navigator.userAgent.toLowerCase();
        return a.indexOf(' qq') > -1 && a.indexOf('mqqbrowser') > -1;
    },
    isIE: function() {
        return navigator.appName === "Microsoft Internet Explorer";
    },
    // 判断是否是JSON字符串
    isJSON: function(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                console.log('error：' + str + '!!!' + e);
                return false;
            }
        }
        console.log('It is not a string!');
    },
    // 判断能否使用JSON.parse方法
    isCanParse: function(str) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true;
            } catch (e) {
                // console.log('error：' + str + '!!!' + e);
                return false;
            }
        }
    },
    /**
     * [关闭页面]
     * 示例
        jsApi.closePage();
     */
    closePage: function() {
        if (this.isWeixin()) {
            // 如果是微信页面，调用微信接口的关闭功能
            WeixinJSBridge.call('closeWindow');
        } else {
            open(location, '_self').close();
        }
    },
    /**
     * [获取浏览器类型]
     * @return {[string]} [浏览器类型名称]
     */
    getBrowser: function() {
        try {
            var browser = navigator.appName,
                b_version = navigator.appVersion,
                version = b_version.split(";"),
                trim_Version = version[1] && version[1].replace(/[ ]/g, "");
            switch (trim_Version) {
                case "MSIE6.0":
                    return "ie6";
                case "MSIE7.0":
                    return "ie7";
                case "MSIE8.0":
                    return "ie8";
                case "MSIE9.0":
                    return "ie9";
                case "MSIE10.0":
                    return "ie10";
                case "MSIE11.0":
                    return "ie11";
                default:
                    return trim_Version;
            }
            return "node";
        } catch (err) {

        }
    },
    /**
     * [转换base64为传入接口参数格式]
     * @param  {[string]} image         [base64对象字符串]
     * 返回处理后的对象，以下是参数说明
     * @return {[string]} Base64String  [可传入接口的base64参数]
     * @return {[string]} Suffix        [图片格式]
     */
    turnBase64: function(image) {
        return {
            Base64String: image.substr(image.indexOf('base64,') + 'base64,'.length),
            Suffix: image.substring(image.indexOf('data:image/') + 'data:image/'.length, image.indexOf(';base64,'))
        };
    },
    /**
     * [数组去重 - 效率高，不会改变数组顺序]
     * @param  {[array]}    arr         [要去重的数组]
     * @param  {[string]}   paramName   [如果比对的都是对象，则按照指定属性来去重，默认id]
     * @return {[array]}                [去重后的数组]
     * 示例
        jsApi.arrUnique([1, 1, 2, 2, 3, 3]);    ==> [1, 2, 3]
     */
    arrUnique: function(arr, paramName) {
        if (!(arr instanceof Array)) {
            console.error('arrUnique方法只接收Array');
            return;
        }
        paramName = paramName || 'id';
        var t = arr,
            a = [],
            o = {},
            i;
        for (i = 0; i < t.length; i++) {
            // 如果数组值为对象，则比对paramName
            if(typeof t[i] === 'object'){
                if(!o[t[i][paramName]]) {
                    o[t[i][paramName]] = 1;
                    a.push(t[i]);
                }
            }else{
                if(!o[t[i]]) {
                    o[t[i]] = 1;
                    a.push(t[i]);
                }
            }
        }
        return a;
    },
    /**
     * [检查数组中是否有对应值]
     * @param  {[array]}            arr [数组]
     * @param  {[string|number]}    val [值]
     * @return {[boolean]}              [是否有对应值]
     */
    arrContain: function(arr, val){
        if (!(arr instanceof Array)) {
            console.error('arrContain方法只接收Array');
            return;
        }
        var result = false;
        for(var i = 0; i < arr.length; i++){
            if(arr[i] === val){
                result = true;
                break;
            }
        }
        return result;
    },
    /**
     * [删除数组中对应值]
     * @param  {[array]}            arr [数组]
     * @param  {[string|number]}    val [值]
     * @return {[array]}                [结果数组]
     */
    arrDelete: function(arr, val){
        if (!(arr instanceof Array)) {
            console.error('arrDelete方法只接收Array');
            return;
        }
        var result = [];
        for(var i = 0; i < arr.length; i++){
            if(arr[i] !== val){
                result.push(arr[i]);
            }
        }
        return result;
    },
    /**
     * [删除数组中对应值，自身数组操作，适用于删除1个元素]
     * @param  {[array]}            arr [数组]
     * @param  {[string|number]}    val [值]
     * @return {[array]}                [结果数组]
     */
    arrDeleteSelf: function(arr, val){
        if (!(arr instanceof Array)) {
            console.error('arrDeleteSelf方法只接收Array');
            return;
        }
        var ind;
        for(var i = 0; i < arr.length; i++){
            if(arr[i] === val){
                ind = i;
                break;
            }
        }
        arr.splice(ind, 1);
    },
    /**
     * [判断是否为空对象]
     * @param  {[object]} obj   [要判断的对象]
     * @return {[boolean]}      [返回布尔值]
     * 示例
        jsApi.objIsEmpty({
            name: "value"
        });
        ==> false
        jsApi.objIsEmpty({});
        ==> true
     */
    objIsEmpty: function(obj) {
        if (typeof obj !== 'object') {
            console.error('objIsEmpty方法只判断Object');
            return;
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },
    /**
     * [设置日期为对应天数之后的日期]
     * 只接收一个对象obj，以下为对应属性参数
     * @param  {[date]} date    [要设置的时间，未设置则默认当前时间]
     * @param  {[number]} day   [设置天数，可以为负数。比如：-1为昨天，1为明天，2为后天]
     * @param  {[number]} month [设置月数，可以为负数。比如：-1为上月，1为下月，2为后月]
     * @return {[date]}         [新的时间]
     * 示例
        jsApi.getDateAfter({
            date: new Date(),
            day: -30
        });
        ==> Sun Apr 08 2018 11:36:46 GMT+0800 (中国标准时间)
     */
    getDateAfter: function(obj) {
        var date;
        if (obj.date === undefined) {
            date = new Date();
        } else if (!(obj.date instanceof Date)) {
            console.error('jsApi.getDateAfter方法的date参数只接收日期对象');
            return;
        } else {
            date = new Date(obj.date);
        }

        var month = obj.month || 0,
            day = obj.day || 0;

        // 设置月数
        date.setMonth(date.getMonth() + month);
        // 设置天数
        date.setDate(date.getDate() + day);
        return date;
    },
    /**
     * [时间格式化]
     * @param  {[date]}    date     [日期对象]
     * @param  {[string]}  fmt      [格式]
     * @return {[string]}           [格式化后的字符串]
     * 示例
        jsApi.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S"); ==> 2006-07-02 08:09:04.423
        jsApi.dateFormat(new Date(), "yyyy-M-d h:m:s.S");      ==> 2006-7-2 8:9:4.18
     */
    dateFormat: function(date, fmt) {
        if (!(date instanceof Date)) {
            console.error('jsApi.dateFormat方法只接收日期对象');
            return;
        }
        var o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S": date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    /**
     * [存储数据]
     * 只接收一个对象data，以下为对应属性参数
     * @param {[string]} type  [session/local；默认session]
     * @param {[object]} keys  [存储多对象]
     * 示例
        // session
        jsApi.setData({
            keys: {
                exp1: "123"
            }
        });
        // local
        jsApi.setData({
            type: "local",
            keys: {
                exp1: "123",
                exp2: 123,
                exp3: {
                    name: "value"
                }
            }
        });
     */
    setData: function(data) {
        if (!(data instanceof Object)) {
            console.error("setData方法只接收Object参数");
            return;
        }
        var type = data.type || 'session',
            keys = data.keys,
            k, v, typeName;
        typeName = type === 'session' ? 'sessionStorage' : 'localStorage';
        for (k in keys) {
            // 保存数据初始的数据类型
            v = JSON.stringify(keys[k]);
            try {
                if (type === 'session') {
                    sessionStorage.setItem(k, v);
                } else if (type === 'local') {
                    localStorage.setItem(k, v);
                }
            } catch(ex){
                // ios safari 无痕模式下，直接使用 setItem 会报错
                console.error(typeName + '.setItem报错, ', ex.message);
            }
        }
    },
    /**
     * [获取数据]
     * 只接收一个对象data，以下为对应属性参数
     * @param  {[string]}           type [session/local；默认session]
     * @param  {[array]}            keys [如果为数组，返回数组内容的数据对象]
     * @param  {[string]}           keys [如果为字符串，返回字符串数据的值]
     * @return {[object|string]}         [获取的数据对象]
     * 示例
        // session
        jsApi.getData({
            keys: ['exp1']
        });
        ==> Object {exp1: "123"}
        // 如果没有对应数据                        ==> Object {exp1: null}

        jsApi.getData({
            keys: 'exp1'
        });
        ==> "123"
        // 如果没有对应数据                        ==> null

        // local
        jsApi.getData({
            type: "local",
            keys: ['exp1', 'exp2', 'exp3']
        });
        ==> Object {exp1: "123", exp2: 123, exp3: Object}
        // 如果没有对应数据                        ==> Object {exp1: null, exp2: null, exp3: null}
     */
    getData: function(data) {
        if (!(data instanceof Object)) {
            console.error("getData方法只接收Object参数");
            return;
        }
        var type = data.type || 'session',
            keys = data.keys,
            result = {},
            i, temp, b, typeName;
        typeName = type === 'session' ? 'sessionStorage' : 'localStorage';

        if (typeof keys === "string") {
            // 如果为字符串，返回字符串数据的值
            try {
                if (type === 'session') {
                    b = sessionStorage.getItem(keys);
                } else if (type === 'local') {
                    b = localStorage.getItem(keys);
                }
                temp = this.isCanParse(b) ? JSON.parse(b) : b;
                return temp;
            } catch(ex){
                // ios safari 无痕模式下，直接使用 getItem 会报错
                console.error(typeName + '.getItem, ', ex.message);
            }
        } else if (keys instanceof Array) {
            // 如果为数组，返回数组内容的数据对象
            for (i = 0; i < keys.length; i++) {
                try {
                    temp = '';
                    if (type === 'session') {
                        b = sessionStorage.getItem(keys[i]);
                    } else if (type === 'local') {
                        b = localStorage.getItem(keys[i]);
                    }
                    temp = this.isCanParse(b) ? JSON.parse(b) : b;
                    result[keys[i]] = temp;
                } catch(ex){
                    // ios safari 无痕模式下，直接使用 getItem 会报错
                    console.error(typeName + '.getItem, ', ex.message);
                }
            }
            return result;
        } else {
            console.error('getData方法的参数中的keys只能传String或Array');
            return;
        }
    },
    /**
     * [删数据]
     * 只接收一个对象data，以下为对应属性参数
     * @param  {[string]}       type    [session/local；默认session]
     * @param  {[string]}       keys    [如果为数组，删除并返回数组内容的数据对象]
     * @param  {[array]}        keys    [如果为字符串，删除并返回字符串数据的值]
     * @return {[object|string]}        [被删除的数据对象]
     * 示例
        // session
        jsApi.deleteData({
            keys: ['exp1']
        });
        ==> Object {exp1: "123"}
        // 如果没有对应数据                        ==> Object {exp1: null}

        jsApi.deleteData({
            keys: 'exp1'
        });
        ==> "123"
        // 如果没有对应数据                        ==> null

        // local
        jsApi.deleteData({
            type: "local",
            keys: ['exp1', 'exp2', 'exp3']
        });
        ==> Object {exp1: "123", exp2: 123, exp3: Object}
        // 如果没有对应数据                        ==> Object {exp1: null, exp2: null, exp3: null}
     */
    deleteData: function(data) {
        if (!(data instanceof Object)) {
            console.error("deleteData方法只接收Object参数");
            return;
        }
        var self = this,
            type = data.type || 'session',
            keys = data.keys,
            i, temp, typeName;
        typeName = type === 'session' ? 'sessionStorage' : 'localStorage';
        if (typeof keys === "string") {
            temp = self.getData({
                type: type,
                keys: keys
            });
            // 如果为字符串，删除并返回字符串数据的值
            try {
                if (type === 'session') {
                    sessionStorage.removeItem(keys);
                } else if (type === 'local') {
                    localStorage.removeItem(keys);
                }
            } catch(ex){
                // ios safari 无痕模式下，直接使用 removeItem 会报错
                console.error(typeName + '.removeItem, ', ex.message);
            }
            return temp;
        } else if (keys instanceof Array) {
            temp = self.getData({
                type: type,
                keys: keys
            });
            for (i = 0; i < keys.length; i++) {
                try {
                    if (type === 'session') {
                        sessionStorage.removeItem(keys[i]);
                    } else if (type === 'local') {
                        localStorage.removeItem(keys[i]);
                    }
                } catch(ex){
                    // ios safari 无痕模式下，直接使用 removeItem 会报错
                    console.error(typeName + '.removeItem, ', ex.message);
                }
            }
            return temp;
        } else {
            console.error('deleteData方法的参数中的keys只能传String或Array');
            return;
        }
    },
    /**
     * [写cookies]
     * 只接收一个对象data，data的属性名为cookie存储名
     * 属性值为对象，以下为对应属性参数
     * @param {[all]} value     [cookie值]
     * @param {[number]} days   [存多少天，默认30天]
     * 示例
        jsApi.setCookie({
            exp1: {
                value: "123",
                days: 1
            },
            exp2: {
                value: 123
            },
            exp3: {
                value: {
                    name: 'value'
                },
                days: 10
            }
        });
     */
    setCookie: function(data) {
        if (!(data instanceof Object)) {
            console.error("setCookie方法只接收Object参数");
            return;
        }
        var days, k, v, date, dateTime = '';

        for (k in data) {
            date = new Date();
            days = data[k].days != null ? data[k].days : 30;
            if(days !== 0){
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                dateTime = 'expires=' + date.toGMTString() + ';';
            }
            // 保存数据初始的数据类型
            v = JSON.stringify(data[k].value);
            document.cookie = k + "=" + escape(v) + ";" + dateTime + "path=/";
        }
    },
    /**
     * [读cookies]
     * @param  {[string]}   data      [如果是字符串类型，则获取name为data的cookie]
     * @param  {[array]}    data      [如果是数组类型，则获取含数组内容的cookie的对象]
     * @return {[object|string]}      [获取的cookies对象]
     * 示例
        jsApi.getCookie("exp");                      ==> "123"
        // 如果没有对应cookie                        ==> null
        jsApi.getCookie(["exp1", 'exp2', 'exp3']);   ==> Object {exp1: "123", exp2: 123, exp3: Object}
        // 如果没有对应cookie                        ==> Object {exp1: null, exp2: null, exp3: null}
     */
    getCookie: function(data) {
        var i = 0;
        if (typeof data === 'string') {
            // 如果是字符串类型，则获取name为data的cookie
            var arr, b,
                reg = new RegExp("(^| )" + data + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                b = unescape(arr[2]);
                return this.isCanParse(b) ? JSON.parse(b) : b;
            } else {
                return null;
            }
        } else if (data instanceof Array) {
            // 如果是数组类型，则获取含数组内容的cookie的对象
            var cookie = document.cookie,
                cookieArr = cookie && cookie.split('; '),
                a, b,
                cookieObj = {},
                resultObj = {};
            for (; i < cookieArr.length; i++) {
                a = cookieArr[i].split('=');
                b = unescape(a[1]);
                cookieObj[a[0]] = this.isCanParse(b) ? JSON.parse(b) : b;
            }
            for (i = 0; i < data.length; i++) {
                resultObj[data[i]] = cookieObj[data[i]] || null;
            }
            return resultObj;
        }
    },
    /**
     * [删cookies]
     * @param  {[string]}   data      [如果是字符串类型，则删除name为data的cookie]
     * @param  {[array]}    data      [如果是数组类型，则删除含数组内容的cookie的对象]
     * @return {[object|string]}      [被删除的cookies对象]
     * 示例
        jsApi.deleteCookie('exp1');                           ==> "123"
        // 如果没有对应cookie                                 ==> null
        jsApi.deleteCookie(['exp1', 'exp2', 'exp3']);         ==> Object {exp1: "123", exp2: 123, exp3: Object}
        // 如果没有对应cookie                                 ==> Object {exp1: null, exp2: null, exp3: null}
     */
    deleteCookie: function(data) {
        var self = this,
            cval, i,
            date = new Date();
        date.setTime(date.getTime() - 1);
        if (typeof data === 'string') {
            cval = self.getCookie(data);
            if (cval != null) {
                document.cookie = data + "=" + cval + ";expires=" + date.toGMTString() + ';path=/';
                return cval;
            } else {
                return null;
            }
        } else if (data instanceof Array) {
            cval = self.getCookie(data);
            for (var i in cval) {
                document.cookie = i + "=" + cval[i] + ";expires=" + date.toGMTString() + ';path=/';
            }
            return cval;
        }
    },
    /**
     * [读location.search]
     * @param  {[string]}   data      [如果是字符串类型，则获取name为data的查询]
     * @param  {[array]}    data      [如果是数组类型，则获取含数组内容的查询的对象]
     * @return {[object|string]}      [获取的查询对象]
     * 示例
        ?exp1="123"&exp2=123
        jsApi.getQuery("exp1");                      ==> "123"
        // 如果没有对应cookie                        ==> null
        jsApi.getQuery(["exp1", 'exp2', 'exp3']);   ==> Object {exp1: "123", exp2: 123, exp3: null}
        // 如果没有对应cookie                        ==> Object {exp1: null, exp2: null, exp3: null}
     */
    getQuery: function(data) {
        var i = 0;
        var search = window.location.search.substr(1) || window.location.hash.split('?')[1];
        if (typeof data === 'string') {
            // 如果是字符串类型，则获取name为data的查询对象
            var arr, b,
                reg = new RegExp("(^|&)" + data + "=([^&]*)(&|$)");
            if (arr = search && search.match(reg)) {
                b = unescape(decodeURIComponent(arr[2]));
                return this.isCanParse(b) ? JSON.parse(b) : b;
            } else {
                return null;
            }
        } else if (data instanceof Array) {
            // 如果是数组类型，则获取含数组内容的查询对象
            var searchArr = search && search.split('&'),
                a, b,
                searchObj = {},
                resultObj = {};
            for (; i < searchArr.length; i++) {
                a = searchArr[i].split('=');
                b = unescape(decodeURIComponent(a[1]));
                searchObj[a[0]] = this.isCanParse(b) ? JSON.parse(b) : b;
            }
            for (i = 0; i < data.length; i++) {
                resultObj[data[i]] = searchObj[data[i]] || null;
            }
            return resultObj;
        }
    }
};

// 对JSON对象的兼容
(function() {
    try {
        if (!window.JSON) {
            window.JSON = {
                parse: function(jsonStr) {
                    return eval('(' + jsonStr + ')');
                },
                stringify: function(jsonObj) {
                    var result = '',
                        curVal;
                    if (jsonObj === null) {
                        return String(jsonObj);
                    }
                    switch (typeof jsonObj) {
                        case 'number':
                        case 'boolean':
                            return String(jsonObj);
                        case 'string':
                            return '"' + jsonObj + '"';
                        case 'undefined':
                        case 'function':
                            return undefined;
                    }

                    switch (Object.prototype.toString.call(jsonObj)) {
                        case '[object Array]':
                            result += '[';
                            for (var i = 0, len = jsonObj.length; i < len; i++) {
                                curVal = JSON.stringify(jsonObj[i]);
                                result += (curVal === undefined ? null : curVal) + ",";
                            }
                            if (result !== '[') {
                                result = result.slice(0, -1);
                            }
                            result += ']';
                            return result;
                        case '[object Date]':
                            return '"' + (jsonObj.toJSON ? jsonObj.toJSON() : jsonObj.toString()) + '"';
                        case '[object RegExp]':
                            return "{}";
                        case '[object Object]':
                            result += '{';
                            for (i in jsonObj) {
                                if (jsonObj.hasOwnProperty(i)) {
                                    curVal = JSON.stringify(jsonObj[i]);
                                    if (curVal !== undefined) {
                                        result += '"' + i + '":' + curVal + ',';
                                    }
                                }
                            }
                            if (result !== '{') {
                                result = result.slice(0, -1);
                            }
                            result += '}';
                            return result;

                        case '[object String]':
                            return '"' + jsonObj.toString() + '"';
                        case '[object Number]':
                        case '[object Boolean]':
                            return jsonObj.toString();
                    }
                }
            };
        }
    } catch (err) {

    }
})();

// assign Polyfill
(function() {
    if (typeof Object.assign != 'function' && typeof Object.defineProperty === 'function') {
        if(jsApi.getBrowser() === 'ie7' || jsApi.getBrowser() === 'ie8' || jsApi.getBrowser() === 'ie9' || jsApi.getBrowser() === 'ie10') return;

        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
})();

// 判断数组是否相等
(function() {
    // Warn if overriding existing method
    if (Array.prototype.equals){
        console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
    }
    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function(array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;
        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;
        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            } else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
    if(typeof Object.defineProperty === 'function'){
        if(jsApi.getBrowser() === 'ie7' || jsApi.getBrowser() === 'ie8' || jsApi.getBrowser() === 'ie9' || jsApi.getBrowser() === 'ie10') return;
        // Hide method from for-in loops
        Object.defineProperty(Array.prototype, "equals", {
            enumerable: false
        });
    }
})();

try {
    module.exports = jsApi;
} catch (err) {

}
