// 生产环境
var path              = require('path');
var fs                = require("fs");
var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin    = require('webpack-manifest-plugin');
var common            = require('./webpack.common.js');

module.exports = {
    devtool: 'false',
    entry: {
        app: path.resolve(__dirname, 'app/index.jsx'),
        // 将 第三方依赖 单独打包
        vendor: [
            'jsApi',
            'react',
            'react-dom',
            'react-redux',
            'react-router-dom',
            'redux',
            'react-addons-pure-render-mixin',
            'es6-promise',
            'whatwg-fetch',
            'braft-editor',
            'crypto',

            'antd/lib/alert',
            'antd/lib/button',
            'antd/lib/checkbox',
            'antd/lib/col',
            'antd/lib/collapse',
            'antd/lib/date-picker',
            'antd/lib/divider',
            'antd/lib/dropdown',
            'antd/lib/form',
            'antd/lib/icon',
            'antd/lib/input',
            'antd/lib/layout',
            'antd/lib/menu',
            'antd/lib/message',
            'antd/lib/modal',
            'antd/lib/pagination',
            'antd/lib/radio',
            'antd/lib/row',
            'antd/lib/select',
            'antd/lib/spin',
            'antd/lib/table',
            'antd/lib/tooltip',
            'antd/lib/tree',
            'antd/lib/upload',
        ]
    },
    output: {
        path: __dirname + "/" + process.env.NODE_ENV,
        filename: "[name].js?v=[chunkhash:8]",
        publicPath: '/'
    },
    resolve: common.resolve,
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/, // test 去判断是否为.js或.jsx,是的话就是进行es6和jsx的编译
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.(less|css)?$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
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
                })
            },
            {
                test: /\.(jpg|jpeg|gif|bmp|png|webp)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]?v=[hash:8]'
                }
            },
            {
                test: /\.(woff|woff2|svg|ttf|eot)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]?v=[hash:8]'
                }
            },
            {
                test: /\.(ico)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?v=[hash:8]'
                }
            }
        ]
    },
    plugins: common.plugins.concat([
        // webpack 内置的 banner-plugin
        new webpack.BannerPlugin("Copyright by lxc."),

        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),

        new webpack.optimize.ModuleConcatenationPlugin(),

        // 分离CSS和JS文件
        new ExtractTextPlugin('[name].css?v=[chunkhash:8]'),

        // 提供公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '[name].js?v=[chunkhash:8]'
        }),

        // 生成一个json文件记录文件md5值
        new ManifestPlugin({

        }),

        // 可在业务 js 代码中使用 __TYPE__ 判断 开发/测试/生产 环境
        new webpack.DefinePlugin({
            __TYPE__: JSON.stringify(process.env.NODE_ENV)
        })
    ])
};
