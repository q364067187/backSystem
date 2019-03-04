// 测试和生产环境
const APPCONFIG = require('./appConfig.js');
const type = process.env.NODE_ENV;
let typeText, port, proxyCfg;

const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');
const fancyLog = require("fancy-log");
const colors = require("ansi-colors");

const app = express();

// 根据环境配置不同
if(type === 'pro'){
    port = APPCONFIG.portPro;
    proxyCfg = APPCONFIG.proxyPro;
    typeText = "生产";
}else if(type === 'test'){
    port = APPCONFIG.portTest;
    proxyCfg = APPCONFIG.proxyTest;
    typeText = "测试";
}
// 反向代理
if(proxyCfg){
    proxyCfg.forEach(function(t, i){
        app.use(proxy(t.server, {
            target: t.target,
            changeOrigin: true
        }));
    });
}

// cookie处理
const cookie = require('cookie-parser');
app.use(cookie());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// 缓存设置
var cacheOptions = {
    maxAge: 24 * 60 * 60 * 365 * 1000
};
app.use('/', express.static(path.resolve(__dirname, type), cacheOptions));

// 启动
app.listen(port, function(){
    fancyLog(colors.green(typeText + "服务已成功启动在" + port + "端口"));
});
