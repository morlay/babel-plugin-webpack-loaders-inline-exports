import { expect } from 'chai';
import { transform } from 'babel-core';
import webpackInlineLoaders from '../index';

describe(__filename, () => {
  it('should transform code', () => {
    const babelOptions = {
      plugins: [
        [webpackInlineLoaders, {
          module: {
            loaders: [{
              test: /\.css/,
              loader: 'file-loader'
            }]
          }
        }]
      ],
      filename: __filename
    };

    expect(transform(`
        var css = require('./fixtures/index.css');
      `, babelOptions).code).to.be.a('string');
  });
  it('should transform code with config', () => {
    const babelOptions = {
      plugins: [
        [webpackInlineLoaders, {
          config: './src/__tests__/fixtures/webpack.config.js'
        }]
      ],
      filename: __filename
    };

    expect(transform(`
        var css = require('./fixtures/index.css');
      `, babelOptions).code).to.be.a('string');
  });
});