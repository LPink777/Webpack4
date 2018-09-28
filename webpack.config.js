const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifycssWebpack = require('purifycss-webpack'); //打包时去除掉没有用到得css
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const glob = require('glob');
const devMode = process.env.NODE_ENV !== 'production';

const website = {
    publicPath: 'http://localhost:3000/'
}

module.exports = {
    // 单页-->index.html 引用了多个js   多页-->  a.html-->index.js || b.html-->a.js 
    // 1.单入口文件得写法
    entry: {
        app: './src/index.js',
        vendor: [
            'react',
            'react-dom',
            'react-router-dom'
        ]
    },
    // 2.数组得写法 
    // entry: ['./src/index.js','./src/a.js'],
    // 3.多入口文件写法 
    // entry: { 
    //     index: './src/index.js',
    //     a: './src/a.js',
    // },

    // 出口文件
    output: {
        filename: '[name].[hash:8].js',
        //这个路径是绝对路径
        path: path.resolve(__dirname, './dist'),
        // publicPath: website.publicPath
    },

    //开发服务器配置
    devServer: {
        contentBase: './dist',
        port: 3000,
        compress: true, //服务器压缩
        open: true, //自动打开浏览器
        hot: true, //热更新 
        // historyApiFallback: true,
        // inline: true,
    },

    //模块配置
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader',
                    'postcss-loader'
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
        new CleanWebpackPlugin(['./dist']),

        new webpack.HotModuleReplacementPlugin(),


        new HtmlWebpackPlugin({ //如果是多入口文件，有几个入口文件就new几个htmlplugin
            filename: 'index.html',
            template: './src/index.html',
            title: 'APP',
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

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),

        // 消除没有用到得css
        new PurifycssWebpack({
            paths: glob.sync(path.resolve(__dirname, 'src/*.html')),
        }),

        // 文件拷贝
        new CopyWebpackPlugin([{
            from: __dirname + '/src/static',
            to: './static'
        }]),

        // 图片压缩
        new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    ],

    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    priority: 10,
                    enforce: true
                },
                utils: {
                    test: /[\\/]common[\\/]/,
                    name: 'common',
                    chunks: 'all',
                    minSize: 0,
                    priority: 10,
                    enforce: true
                }
            }
        }
    },

    //配置解析
    resolve: {
        //替换文件路径
        alias: {
            '@': path.join(__dirname, './src'),
        },
        extensions: ['.js', 'jsx', '.json', '.css'],
    },

    devtool: 'source-map'
};