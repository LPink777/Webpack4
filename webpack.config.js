const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PurifycssWebpack = require('purifycss-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const website = {
    publicPath: 'http://localhost:3000/'
}

module.exports = {
    entry: {
        app: './src/index.js',
        vendor: ['react', 'react-dom', 'react-router-dom'],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:4].js',
        chunkFilename: '[id].[hash:8].bundle.js',
    },

    optimization: {
        splitChunks: {
            chunks: "all",
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
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 10
                },
            },
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.css\.*(?!.*map)/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    discardComments: { removeAll: true },
                    safe: true,
                    autoprefixer: false
                },
                canPrint: true
            }),
        ]
    },

    module: {
        unknownContextCritical: false,
        rules: [{
            test: /\.css$/,
            loaders: [
                MiniCssExtractPlugin.loader,
                'happypack/loader?id=css',
            ],
            include: path.resolve(__dirname, 'src'),
        }, {
            test: /\.js$/,
            use: ['happypack/loader?id=babel'],
            exclude: /(node_modules)/,
        }, {
            test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024 * 30,
                    fallback: 'file-loader',
                }
            }]
        }]
    },

    plugins: [
        new CleanWebpackPlugin(['./dist']),

        new webpack.HotModuleReplacementPlugin(),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            title: 'APP',
            hash: true,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            },
        }),

        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            uglifyJS: {
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false,
                },
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            },
        }),

        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: [{
                path: 'babel-loader',
                query: {
                    babelrc: true,
                    cacheDirectory: true,
                    presets: [
                        'stage-3', 'es2015', 'react'
                    ],
                    plugins: ['transform-runtime', "transform-class-properties"]
                },
            }],
            // ... 其它配置项
            threadPool: happyThreadPool,
            verboseWhenProfiling: true
        }),

        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verboseWhenProfiling: true,
            loaders: [{
                    loader: 'css-loader',
                    query: {
                        minimize: true,
                        sourceMap: false
                    }
                },
                {
                    loader: 'postcss-loader',
                    query: {
                        plugins: (loader) => [
                            require('autoprefixer')()
                        ],
                        sourceMap: false
                    }
                }
            ]
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].[hash:4].css',
        }),

        // 告诉 Webpack 使用了哪些动态链接库
        new DllReferencePlugin({
            // 描述 react 动态链接库的文件内容
            manifest: require('./dll/react.manifest.json'),
        }),
        new DllReferencePlugin({
            // 描述 polyfill 动态链接库的文件内容
            manifest: require('./dll/polyfill.manifest.json'),
        }),

        new PurifycssWebpack({
            paths: glob.sync(path.resolve(__dirname, 'src/*.html')),
        }),

        new CopyWebpackPlugin([{
            from: __dirname + '/src/static',
            to: './static'
        }, {
            from: path.resolve(__dirname, 'dll/react.dll.js'),
            to: path.resolve(__dirname, 'dist')
        }, {
            from: path.resolve(__dirname, 'dll/polyfill.dll.js'),
            to: path.resolve(__dirname, 'dist')
        }]),
    ],

    devServer: {
        contentBase: './dist',
        port: 3000,
        compress: true,
        open: true,
        hot: true,
        historyApiFallback: true,
        inline: true,
    },

    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
        extensions: ['.js', 'jsx', '.css'],
    },

    mode: 'producttion',

    devtool: 'cheap-module-source-map',

};