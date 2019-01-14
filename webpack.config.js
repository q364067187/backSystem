// 开发环境
var path      = require('path');
var webpack   = require('webpack');
var common    = require('./webpack.common.js');
var APPCONFIG = require('./appConfig.js');
var proxy     = {};

APPCONFIG.proxyDev.forEach(function(item, index){
    proxy[item.server] = {
        target: item.target,
        secure: false,
        changeOrigin: true,
    };
});

module.exports = {
    entry: common.entry,
    output: {
        filename: "[name].js"
    },
    resolve: common.resolve,
    module: {
        rules: common.module.rules.concat([
            {
                test: /\.(less|css)?$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: {
                            "sourceMap": true,
                            "modifyVars": common.theme
                        }
                    }
                ]
            }
        ])
    },
    plugins: common.plugins.concat([

    ]),
    devServer: {
        proxy              : proxy,
        port               : APPCONFIG.portDev,         // 端口号
        contentBase        : "./",                      // 本地服务器所加载的页面所在的目录
        historyApiFallback : true,                      // 不跳转
        inline             : true,                      // 实时刷新
        hot                : true                       // 热加载
    }
};
