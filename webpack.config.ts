import path from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default <Configuration>{
    entry: {
        main: [
            '@babel/polyfill',
            './src/app.ts'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        publicPath: './',
        chunkFilename: '[id].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.glsl'],
        alias: {
            '@': path.resolve(__dirname, 'src/')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-object-rest-spread'
                        ]
                    }
                }
            },
            {
                test: /\.(glsl|vert|flag)$/,
                use: 'raw-loader'
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new DefinePlugin({
            CANVAS_RENDERER: true,
            GAME_WIDTH: 640,
            GAME_HEIGHT: 360,
            WEBGL_RENDERER: true
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true
            }
        })
    ],
    devServer: {
        host: 'localhost',
        port: 3000,
        publicPath: '/'
    }
}