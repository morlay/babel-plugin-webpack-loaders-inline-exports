import * as _ from "lodash";
import { test } from "ava";
import getExportsFromCodeString from "./helpers/getExportsFromCodeString";

import runWebpackSync from "../runWebpackSync";

test("runWebpackSync should transform code string", (t) => {
  const codeString = runWebpackSync(`${process.cwd()}/fixtures/some2.css`, {
    module: {
      rules: [{
        test: /\.css$/,
        loader: "file-loader",
      }],
    },
  });

  const result = getExportsFromCodeString(codeString);

  t.true(_.isString(result));
});
