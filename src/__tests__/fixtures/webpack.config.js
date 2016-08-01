const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './main.js',
  output: {
    path: './dist',
  },
  plugins: [
    new ExtractTextPlugin('app', '[name].css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].js',
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]',
        ]),
      },
    ],
  },
};
