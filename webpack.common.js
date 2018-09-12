var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');

// 本地资源
var libJsSrc = path.resolve(__dirname, "../../htmlTemp/libs/js/");

module.exports = {
    // antd主题颜色
    theme: {
        "primary-color": "#43bbf8"
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        // 别名
        alias: {
            // 公用js方法
            jsApi       : libJsSrc + '/jsApi.js',
            SHA1        : libJsSrc + '/加密/SHA1.js',                                 // SHA1
            appConfig   : path.resolve(__dirname, './appConfig.js'),
            options     : path.resolve(__dirname, '../config/options.js'),            // 网站配置
            sign        : path.resolve(__dirname, '../config/sign.js'),               // 签名
            reason      : path.resolve(__dirname, '../config/reason.js'),             // 错误码
        }
    },
    plugins: [
        // 当模块使用这些变量的时候,wepback会自动加载。
        new webpack.ProvidePlugin({
            jsApi       : "jsApi",
            options     : 'options',
            sign        : 'sign',
            appConfig   : 'appConfig',
        }),

        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.tmpl.html',
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
    ]
};
