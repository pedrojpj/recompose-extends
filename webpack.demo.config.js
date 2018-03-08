const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './example/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve('docs'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('example/index.html')
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ],
  devServer: {
    contentBase: path.resolve('docs'),
    port: 8090
  }
};
