import * as path from "path";
import * as _ from "lodash";
import { test } from "ava";
import { transform } from "babel-core";

import getExportsFromCodeString from "./helpers/getExportsFromCodeString";
import webpackInlineLoaders from "../index";

const source = `
  exports.css = require("${process.cwd()}/fixtures/some2.css");
  exports.scss = require("${process.cwd()}/fixtures/some.scss");
  exports.txt = require("${process.cwd()}/fixtures/some.txt");
  exports.svg = require("${process.cwd()}/fixtures/some.svg");
`;

test("should transform code with config", (t) => {
  const babelOptions = {
    plugins: [
      [
        webpackInlineLoaders,
        require(path.join(process.cwd(), "./fixtures/webpack.config.js")),
      ],
    ],
    filename: __filename,
  };

  const codeString = transform(source, babelOptions).code;

  const exports = getExportsFromCodeString(codeString) as any;

  t.true(_.isObject(exports.css));
  t.true(_.isObject(exports.scss));
  t.true(_.isString(exports.txt));
  t.true(_.isObject(exports.svg));
});

test("should transform code with absolute configFile", (t) => {
  const babelOptions = {
    plugins: [
      [
        webpackInlineLoaders,
        {
          configFile: path.join(process.cwd(), "./fixtures/webpack.config.js"),
        },
      ],
    ],
    filename: __filename,
  };

  const codeString = transform(source, babelOptions).code;

  const exports = getExportsFromCodeString(codeString);

  t.true(_.isObject(exports));
});

test("should transform code with relative configFile", (t) => {
  const babelOptions = {
    plugins: [
      [
        webpackInlineLoaders,
        {
          configFile: "$PWD/fixtures/webpack.config.js",
        },
      ],
    ],
    filename: __filename,
  };

  const codeString = transform(source, babelOptions).code;

  const exports = getExportsFromCodeString(codeString);

  t.true(_.isObject(exports));
});
