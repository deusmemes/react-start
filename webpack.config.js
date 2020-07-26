const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
};

const filename = (folder, ext) => isDev ? `${folder}/[name].${ext}` : `${folder}/[name].[hash:8].${ext}`;

module.exports = {
    entry: "./src/index.js",
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: "js/bundle.js"
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        // contentBase: 'public',
        compress: true,
        open: true,
        port: 9000,
        hot: isDev
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options:{
                    presets:["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name]-[hash:8].[ext]'
                        },
                    },
                ]
            },
            {
                test: /\.s?[ac]ss$/,
                loader: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        isProd && new CleanWebpackPlugin(),
        new CopyWebpackPlugin([

        ]),
        new MiniCssExtractPlugin({
            filename: filename('css', 'css')
        })
    ]
};
