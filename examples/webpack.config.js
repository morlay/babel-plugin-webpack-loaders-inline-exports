const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: './main.js',
  output: {
    path: './dist',
  },
  plugins: [
    new ExtractTextPlugin('app', '[name].css'),
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]'
        ]),
      },
      {
        test: /\.scss$/,
        loader: 'css-loader',
      },
      {
        test: /\.(txt|svg)$/,
        loader: 'raw-loader',
      },
      {
        test: /\.svg$/,
        loaders: [
          'svg2jsx',
          'svgo-loader?useConfig=svgo',
        ],
      },
    ],
  },
  svgo: {
    plugins: [
      { removeMetadata: true },
      { removeTitle: true },
      { removeDesc: true },
      { removeDimensions: true },
      { convertColors: { shorthex: false } },
      { convertPathData: false },
    ],
  },
};
