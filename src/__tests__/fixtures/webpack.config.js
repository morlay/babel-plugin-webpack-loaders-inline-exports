const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './main.js',
  output: {
    path: './dist'
  },
  plugins: [
    new ExtractTextPlugin('app', '[name].css')
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]'
        ])
      }
    ]
  }
};