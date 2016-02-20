## babel-plugin-webpack-loaders-inline-exports

Make webpack-loaders inline exports 

[![Build Status](https://img.shields.io/travis/morlay/babel-plugin-webpack-loaders-inline-exports.svg?style=flat-square)](https://travis-ci.org/morlay/babel-plugin-webpack-loaders-inline-exports)
[![NPM](https://img.shields.io/npm/v/babel-plugin-webpack-loaders-inline-exports.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-webpack-loaders-inline-exports)
[![Dependencies](https://img.shields.io/david/morlay/babel-plugin-webpack-loaders-inline-exports.svg?style=flat-square)](https://david-dm.org/morlay/babel-plugin-webpack-loaders-inline-exports)
[![License](https://img.shields.io/npm/l/babel-plugin-webpack-loaders-inline-exports.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-webpack-loaders-inline-exports)


[webpack-loaders](https://github.com/istarkov/babel-plugin-webpack-loaders) is cool, 
but it did some transforms from loader compiled result.

For each matched loader, they could transform as a commonjs module
 
```js
module.exports = webpackBootstrap([
  function (module, exports, __webpack_require__){
    module.exports = __webpack_require__.p + 'xxsdfasdasd.txt';
  }
])
```
and we can just pick the webpackResult as inline exports

```js
const txt = require('./some.txt');
```
will be 
```js
const txt = webpackBootstrap([
  function (module, exports, __webpack_require__){
    module.exports = __webpack_require__.p + 'xxsdfasdasd.txt';
  }
]);
```

And for some loader, they may exports with other dependences, but it will works well.
in this plugin, webpackConfig will be overwrite by the special config below: 

```js
{
  entry: filename,
  output: {      
    libraryTarget: 'commonjs2',
  },
  externals: [      
    (context, subRequest, callback) => {
      if (subRequest !== filename) {
        callback(null, subRequest);
      } else {
          callback();
      }
    }
  ]
}
```
To make sure only process the target file which is matched by loader.

## Options

all options same as webpack, and we can assign a config by the webpack config file

```json
{
  "plugins": [
    [
       "babel-plugin-webpack-loaders-inline-exports",
       {
          "config": "./webpack.config.js"
       }
    ]
  ]
}
```
special options in babel option for this plugin will merge into webpack config.


### Warning

* Please use this only in Node.
* And for `css-loader`, should use with `extract-text-webpack-plugin` and don't use with `style-loader`