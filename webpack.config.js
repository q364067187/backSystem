// 开发环境
var path      = require('path');
var webpack   = require('webpack');
var common    = require('./webpack.common.js');
var appConfig = require('./appConfig.js');
var proxy     = {};

appConfig.proxyDev.forEach(function(item, index){
    proxy[item.server] = {
        target: item.target,
        secure: false,
        changeOrigin: true,
    };
});

module.exports = {
    entry: path.resolve(__dirname, 'app/index.jsx'),
    output: {
        filename: "bundle.js"
    },
    resolve: common.resolve,
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/, // test 去判断是否为.js或.jsx,是的话就进行es6和jsx的编译
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
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
            },
            {
                test: /\.(jpg|jpeg|gif|bmp|png|webp)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|svg|ttf|eot)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(ico)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    },
    plugins: common.plugins.concat([
        // 可在业务 js 代码中使用 __TYPE__ 判断 开发/测试/生产 环境
        new webpack.DefinePlugin({
            __TYPE__: JSON.stringify(process.env.NODE_ENV)
        })
    ]),
    devServer: {
        proxy              : proxy,
        port               : appConfig.portDev,         // 端口号
        contentBase        : "./",                      // 本地服务器所加载的页面所在的目录
        historyApiFallback : true,                      // 不跳转
        inline             : true,                      // 实时刷新
        hot                : true                       // 热加载
    }
};
