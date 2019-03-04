// 公共配置
var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SpritesmithPlugin = require('lxc-webpack-spritesmith');

module.exports = {
    // antd主题颜色
    theme: {
        "primary-color": "#43bbf8"
    },
    entry: {
        // 将 第三方依赖 单独打包
        vendor: [
            'lxc-js-api',
            'react',
            'react-dom',
            'react-redux',
            'react-router-dom',
            'redux',
            'react-addons-pure-render-mixin',
            'es6-promise',
            'whatwg-fetch',
            'braft-editor',
            // 'moment',

            // 'antd/lib/alert',
            'antd/lib/back-top',
            'antd/lib/button',
            // 'antd/lib/checkbox',
            'antd/lib/col',
            // 'antd/lib/collapse',
            // 'antd/lib/date-picker',
            'antd/lib/divider',
            'antd/lib/dropdown',
            'antd/lib/form',
            'antd/lib/icon',
            'antd/lib/input',
            'antd/lib/layout',
            'antd/lib/menu',
            'antd/lib/message',
            'antd/lib/modal',
            // 'antd/lib/pagination',
            // 'antd/lib/radio',
            'antd/lib/row',
            'antd/lib/select',
            // 'antd/lib/switch',
            'antd/lib/spin',
            'antd/lib/table',
            // 'antd/lib/tabs',
            // 'antd/lib/tooltip',
            // 'antd/lib/tree',
            'antd/lib/upload',
        ],
        app: path.resolve(__dirname, 'app/index.jsx')
    },
    module: {
        rules: [
            {
                test: /\.(ico)?$/i,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?v=[hash:8]'
                }
            },
            {
                test: /\.(js|jsx)?$/, // test 去判断是否为.js或.jsx,是的话就进行es6和jsx的编译
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
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
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        // 别名
        alias: {
            APP          : path.resolve(__dirname, './app'),                          // APP目录
            appConfig    : path.resolve(__dirname, './appConfig.js'),                 // 项目配置
            uploadConfig : path.resolve(__dirname, './uploadConfig.js'),              // 上传配置
        }
    },
    plugins: [
        // 当模块使用这些变量的时候,wepback会自动加载。
        new webpack.ProvidePlugin({
            JSAPI        : 'lxc-js-api',
            APPCONFIG    : 'appConfig',
            UPLOADCONFIG : 'uploadConfig',
        }),

        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.html',
            favicon: './favicon.ico'
        }),

        // postcss设置
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return [
                        require("autoprefixer")({
                            browsers: ['last 100 versions']
                        })
                    ]
                }
            }
        }),

        // 雪碧图
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, './app/static/images/icon'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './app/static/images/sprite.png'),
                css: path.resolve(__dirname, './app/static/less/sprite.less')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: '../images/sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down',
                padding: 10
            }
        }),

        // 可在业务 js 代码中使用 __TYPE__ 判断 开发/测试/生产 环境
        new webpack.DefinePlugin({
            __TYPE__: JSON.stringify(process.env.NODE_ENV)
        })
    ]
};
