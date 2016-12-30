const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

const extractText = new ExtractTextPlugin({
  filename: "[name].css",
});

module.exports = {
  context: process.cwd(),
  entry: "./fixtures/main.js",
  output: {
    path: "./dist",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: extractText.extract({
          loader: "css-loader",
          query: {
            modules: true,
            importLoaders: 1,
            localIdentName: "[name]__[local]--[hash:base64:5]",
          },
        }),
      },
      {
        test: /\.scss$/,
        loader: extractText.extract({
          loader: "css-loader",
          query: {
            modules: true,
            importLoaders: 1,
            localIdentName: "[name]__[local]--[hash:base64:5]",
          },
        }),
      },
      {
        test: /\.txt$/,
        loader: "raw-loader",
      },
      {
        test: /\.svg$/,
        loaders: [
          "svg2jsx",
          "svgo-loader?useConfig=svgo",
        ],
      },
    ],
  },
  plugins: [
    extractText,
    new webpack.LoaderOptionsPlugin({
      options: {
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
      }
    })
  ]
};
