const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifycssWebpack = require('purifycss-webpack') //打包时去除掉没有用到得css
const glob = require('glob');

const cssExtract = new ExtractTextWebpackPlugin({
    filename: 'css/[name]-one.css',
});
const lessExtract = new ExtractTextWebpackPlugin({
    filename: 'css/[name]-two.css',
});

module.exports = {
    // 单页-->index.html 引用了多个js   多页-->  a.html-->index.js || b.html-->a.js 
    // 1.单入口文件得写法
    entry: './src/index.js',
    // 2.数组得写法 
    // entry: ['./src/index.js','./src/a.js'],
    // 3.多入口文件写法 
    // entry: { 
    //     index: './src/index.js',
    //     a: './src/a.js',
    // },

    // 出口文件
    output: {
        filename: '[name].[hash:7].js',
        //这个路径是绝对路径
        path: path.resolve('./dist')
    },

    //开发服务器配置
    devServer: {
        contentBase: './dist',
        port: 3000,
        compress: true, //服务器压缩
        open: true, //自动打开浏览器
        hot: true, //热更新
    },

    //模块配置
    module: {
        rules: [{
                test: /\.css$/,
                use: cssExtract.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'postcss-loader', //补全css样式兼容
                    }]
                })
            }, {
                test: /\.less$/i,
                use: lessExtract.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'less-loader',
                    }]
                }),
            },

        ]
    },

    //插件配置
    plugins: [
        cssExtract,
        lessExtract,
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['./dist']),
        new HtmlWebpackPlugin({ //如果是多入口文件，有几个入口文件就new几个htmlplugin
            filename: 'index.html',
            template: './src/index.html',
            title: 'my-front-end',
            hash: true, //引文件得时候后缀加hash
            // minify: {     removeAttributeQuotes: true, //删除双引号     collapseWhitespace:
            // true, //折叠空行,变为一行 }
            // chunks: ['index'], //选择对应得入口文件
        }),
        // new HtmlWebpackPlugin({     filename: 'b.html',     template:
        // './src/index.html',     title: 'my-front-end',     hash: true,     chunks:
        // ['a'], })

        //消除没有用到得css
        new PurifycssWebpack({
            paths: glob.sync(path.resolve('src/*.html')),
        })
    ],

    //模式
    mode: 'development',

    //配置解析
    resolve: {}
}