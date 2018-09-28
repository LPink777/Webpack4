const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifycssWebpack = require('purifycss-webpack'); //打包时去除掉没有用到得css
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const glob = require('glob');
const devMode = process.env.NODE_ENV !== 'production';

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
        path: path.resolve(__dirname, './dist')
    },

    //开发服务器配置
    devServer: {
        contentBase: './dist',
        port: 3000,
        compress: true, //服务器压缩
        open: true, //自动打开浏览器
        hot: true, //热更新 
        historyApiFallback: true,
        inline: true,
    },

    //模块配置
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            }, {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader?cacheDirectory',
                    options: {
                        presets: [
                            'stage-3', 'es2015', 'react'
                        ],
                        plugins: ['transform-runtime', "transform-class-properties"]
                    }
                }
            }, {
                test: /\.(html|htm)/,
                use: {
                    loader: 'html-withimg-loader'
                }
            }, {
                test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 30KB 以下的文件采用 url-loader
                        limit: 1024 * 30,
                        // 否则采用 file-loader，默认值就是 file-loader 
                        fallback: 'file-loader',
                    }
                }]
            }

        ]
    },

    //插件配置
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),

        new webpack.HotModuleReplacementPlugin(),

        new CleanWebpackPlugin(['./dist']),

        new HtmlWebpackPlugin({ //如果是多入口文件，有几个入口文件就new几个htmlplugin
            filename: 'index.html',
            template: './src/index.html',
            title: 'webpack4.0',
            hash: true, //引文件得时候后缀加hash
            // minify: {
            //     //删除双引号   
            //     removeAttributeQuotes: true,
            //     //折叠空行,变为一行
            //     collapseWhitespace: true,
            // },
            // //选择对应得入口文件
            // chunks: ['index'], 
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'b.html',
        //     template: './src/index.html',
        //     title: 'webpack4.0',
        //     hash: true,
        //     chunks: ['a'],
        // })

        //消除没有用到得css
        new PurifycssWebpack({
            paths: glob.sync(path.resolve('src/*.html')),
        }),

        // new UglifyJsPlugin({
        //     // 最紧凑的输出
        //     beautify: false,
        //     // 删除所有的注释
        //     comments: false,
        //     compress: {
        //         // 在UglifyJs删除没有用到的代码时不输出警告
        //         warnings: false,
        //         // 删除所有的 `console` 语句，可以兼容ie浏览器
        //         drop_console: true,
        //         // 内嵌定义了但是只用到一次的变量
        //         collapse_vars: true,
        //         // 提取出出现多次但是没有定义成变量去引用的静态值
        //         reduce_vars: true,
        //     }
        // }),

        //文件拷贝
        new CopyWebpackPlugin([{
            from: __dirname + '/src/static',
            to: './static'
        }]),

        //图片压缩
        new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    ],

    //模式
    mode: 'development',

    // 输出文件性能检查配置
    performance: {
        hints: 'warning', // 有性能问题时输出警告
        maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
        maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
    },

    //配置解析
    resolve: {
        //替换文件路径
        alias: {
            '@': path.join(__dirname, './src'),
        },
        extensions: ['.js', 'jsx', '.json', '.css', '.less'],
        modules: [path.resolve(__dirname, 'node_modules')]
    },

    devtool: 'source-map'
};