import _ from 'lodash';
import test, { AssertContext } from 'ava';
import getExportsFromCodeString from './helpers/getExportsFromCodeString';

import runWebpackSync from '../runWebpackSync';

test('runWebpackSync should transform code string', (t: AssertContext) => {
  const codeString = runWebpackSync('./fixtures/some.css', {
    module: {
      loaders: [{
        test: /\.css/,
        loader: 'file-loader',
      }],
    },
  });

  const result = getExportsFromCodeString(codeString);

  t.true(_.isString(result));
});
