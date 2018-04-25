const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const autoprefixer = require('autoprefixer');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const extractPlugin = new ExtractTextPlugin({ filename: './assets/css/[name].[chunkhash].css' });

const entry = {
    app: './assets/js/app.js',
    login: './assets/js/login.js',
    vendors: ['font-awesome/scss/font-awesome.scss', 'jquery']
}

const plugins = [

    extractPlugin,
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(['dist']),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
    /* Enable this in production only */
    /* new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
   }), */
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
        inject: 'body',
        hash: true,
        chunks: ['app'],
        template: './pages/index.html',
        filename: './pages/index.html',
    }),
    new HtmlWebpackPlugin({
        inject: 'body',
        hash: true,
        chunks: ['login', 'vendors'],
        template: './pages/login.html',
        filename: './pages/login.html'
    }),
]


const config = {

    context: path.resolve(__dirname, 'src'),

    entry,

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './assets/js/[name].[chunkhash].js'
    },

    module: {
        rules: [
            //babel-loader
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env']
                    }
                }
            },
            
            //html-loader
            { test: /\.html$/, use: ['html-loader'] },

            // sass(scss), css loader
            {
                test: /\.(css|sass|scss)$/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
            },

            // font loader
            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            },

            //file-loader(for images)
            {
                test: /\.(jpeg|jpg|png|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options:
                        {
                            name: '[path][name].[ext]',
                            publicPath: '../',
                        }
                }]
            },

            // for plugins like Jquery, bootstrap, font-awesome etc
            { test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/, loader: "imports?this=>window" },
            { test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/, loader: "imports?define=>false" },
            { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },

            // font-awesome
            {
                test: /font-awesome\.config\.js/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'font-awesome-loader' }
                ]
            },
        ]
    },

    plugins,

    devtool: 'inline-source-map',

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        },
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                extractComments: true,
                uglifyOptions: {
                    compress: true,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            })
        ]
    }


}

module.exports = config;