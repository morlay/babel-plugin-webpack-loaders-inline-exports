import test, { AssertContext } from 'ava';
import path from 'path';
import _ from 'lodash';
import { transform } from 'babel-core';

import getExportsFromCodeString from './helpers/getExportsFromCodeString';
import webpackInlineLoaders from '../index';

const source = `
  exports.css = require('./fixtures/some.css');
  exports.scss = require('./fixtures/some.scss');
  exports.txt = require('./fixtures/some.txt');
  exports.svg = require('./fixtures/some.svg');
`;

test('should transform code with config', (t: AssertContext) => {
  const babelOptions = {
    plugins: [
      [
        webpackInlineLoaders,
        require('./fixtures/webpack.config.js'),
      ],
    ],
    filename: __filename,
  };

  const codeString = transform(source, babelOptions).code;

  const exports = getExportsFromCodeString(codeString);

  t.true(_.isObject(exports.css));
  t.true(_.isObject(exports.scss));
  t.true(_.isString(exports.txt));
  t.true(_.isObject(exports.svg));
});


test('should transform code with absolute configFile', (t: AssertContext) => {
  const babelOptions = {
    plugins: [
      [
        webpackInlineLoaders,
        {
          configFile: path.join(__dirname, './fixtures/webpack.config.js'),
        },
      ],
    ],
    filename: __filename,
  };

  const codeString = transform(source, babelOptions).code;

  const exports = getExportsFromCodeString(codeString);

  t.true(_.isObject(exports));
});

test('should transform code with relative configFile', (t: AssertContext) => {
  const babelOptions = {
    plugins: [
      [
        webpackInlineLoaders,
        {
          configFile: './fixtures/webpack.config.js',
        },
      ],
    ],
    filename: __filename,
  };

  const codeString = transform(source, babelOptions).code;

  const exports = getExportsFromCodeString(codeString);

  t.true(_.isObject(exports));
});

test('should transform code with relative configFile', (t: AssertContext) => {
  const babelOptions = {
    plugins: [
      [
        webpackInlineLoaders,
        {
          configFile: '$PWD/src/__tests__/fixtures/webpack.config.js',
        },
      ],
    ],
    filename: __filename,
  };

  const codeString = transform(source, babelOptions).code;

  const exports = getExportsFromCodeString(codeString);

  t.true(_.isObject(exports));
});
