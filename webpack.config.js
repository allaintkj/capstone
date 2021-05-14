const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = (env, args) => {
    const devMode = args.mode !== 'production';
    const minimizer = devMode ? [] : [
        new TerserPlugin({
            extractComments: false
        }),
        new OptimizeCSSAssetsPlugin({})
    ];

    // configure plugins
    const htmlPlugin = new HtmlWebPackPlugin({
        inject: true,
        template: './src/index.html',
        filename: 'index.html'
    });
    const extractCssPlugin = new MiniCssExtractPlugin({
        filename: '[name].css'
    });

    // populate plugin array
    let pluginArray = [htmlPlugin, extractCssPlugin];

    // return webpack config object
    return {
        devServer: {
            historyApiFallback: true,
            host: '0.0.0.0',
            hot: true
        },
        devtool: 'source-map',
        entry: './src/index.js',
        optimization: {
            minimize: true,
            minimizer: minimizer
        },
        output: {
            path: path.resolve(__dirname, 'dist/'),
            publicPath: '/',
            filename: '[name].js'
        },
        performance: {
            hints: false
        },
        module: {
            rules: [{
                test: /\.js$/,
                enforce: 'pre',
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env', '@babel/react'],
                        minified: true,
                        comments: false,
                        compact: true
                    }
                }]
            }, {
                test: /\.(s*)css$/,
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: devMode
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: devMode,
                        ident: 'postcss',
                        plugins: () => [
                            require('autoprefixer')({
                                browsers: [
                                    '>1%',
                                    'last 2 versions',
                                    'not ie < 11'
                                ]
                            })
                        ]
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: devMode
                    }
                }]
            }, {
                test: /\.(gif|png|jpe?g|svg)$/i,
                include: path.resolve(__dirname, 'src/img/'),
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }]
            }, {
                test: /\.(woff(2)?|ttf|eot|svg)$/i,
                include: path.resolve(__dirname, 'src/fonts/'),
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }, {
                test: /\.html$/,
                exclude: path.resolve(__dirname, 'node_modules/'),
                use: [{
                    loader: 'html-loader'
                }]
            }]
        },
        plugins: pluginArray
    };
};
