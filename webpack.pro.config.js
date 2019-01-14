// 生产环境
var path              = require('path');
var fs                = require("fs");
var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin    = require('webpack-manifest-plugin');
var common            = require('./webpack.common.js');

module.exports = {
    devtool: 'false',
    entry: common.entry,
    output: {
        path: __dirname + "/" + process.env.NODE_ENV,
        filename: "[name].js?v=[chunkhash:8]",
        publicPath: '/'
    },
    resolve: common.resolve,
    module: {
        rules: common.module.rules.concat([
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
            }
        ])
    },
    plugins: common.plugins.concat([
        // webpack 内置的 banner-plugin
        new webpack.BannerPlugin("Copyright by lxc."),

        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),

        new webpack.optimize.ModuleConcatenationPlugin(),

        // 分离CSS和JS文件
        new ExtractTextPlugin('[name].css?v=[hash:8]'),

        // 提供公共代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '[name].js?v=[chunkhash:8]'
        }),

        // 生成一个json文件记录文件md5值
        new ManifestPlugin({

        })
    ])
};
