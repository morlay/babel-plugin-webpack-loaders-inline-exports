const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractText = new ExtractTextPlugin({ filename: '[name].css' });

module.exports = {
  context: __dirname,
  entry: './main.js',
  output: {
    path: './dist',
    filename: '[name].js',
  },
  plugins: [
    extractText,
  ],
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          compact: true,
          presets: [
            ['@morlay/babel-preset', {
              targets: {
                browsers: 'last 2 safari versions',
              },
              modules: false,
            }],
          ],
        },
      },
      {
        test: /\.css$/,
        loader: extractText.extract([
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]',
        ]),
      },
      {
        test: /\.scss$/,
        loader: extractText.extract([
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]',
        ]),
      },
      {
        test: /\.txt$/,
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
