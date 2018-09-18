var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
    // antd主题颜色
    theme: {
        "primary-color": "#43bbf8"
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        // 别名
        alias: {
            SRC       : path.resolve(__dirname, './src'),
            APPCONFIG : path.resolve(__dirname, './appConfig.js'),
        }
    },
    plugins: [
        // 当模块使用这些变量的时候,wepback会自动加载。
        new webpack.ProvidePlugin({
            APPCONFIG : 'APPCONFIG',
        }),

        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
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
                cwd: path.resolve(__dirname, './src/static/images/icon'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './src/static/images/sprite.png'),
                css: path.resolve(__dirname, './src/static/less/sprite.less')
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
