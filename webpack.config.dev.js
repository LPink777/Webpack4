const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
        vendor: ['react', 'react-dom', 'react-router-dom'],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:4].js',
        chunkFilename: '[id].[hash:8].js',
    },

    module: {
        unknownContextCritical: false,
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ],
            include: path.resolve(__dirname, 'src'),
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
                    limit: 1024 * 30,
                    fallback: 'file-loader',
                }
            }]
        }]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),

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

    mode: 'development',

    devtool: 'cheap-module-eval-source-map',

};