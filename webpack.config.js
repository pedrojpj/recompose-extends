const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './dist/recompose-extends.js',
    libraryTarget: 'umd',
    library: 'recompose-extends'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])]
};
