const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'bundle.js',
      publicPath: ''
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Starter Angular - kitconcept',
      template: 'src/index.ejs',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    })
  ],
  module: {
    loaders: [{
        test: /\.js$/,
        loaders: [{loader: 'babel-loader', options: {plugins: ["angularjs-annotate"]}}],
        exclude: /node_modules/
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.scss$/, loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']},
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.jade$/, loader: 'jade-loader' },
      // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      // helps to load bootstrap's css.
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.woff2$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml' }
    ]
  },
  devtool: 'inline-source-map'
};
