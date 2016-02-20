import { expect } from 'chai';
import path from 'path';
import transformFileSync from '../runWebpackSync';

describe(__filename, () => {
  const targetFile = path.join(__dirname, 'fixtures/icon.svg');
  it('getLoaders should pick the matched loaders', () => {
    const result = transformFileSync(targetFile, {
      module: {
        loaders: [{
          test: /\.svg/,
          loader: 'svg2jsx'
        }]
      }
    });
    expect(result).to.be.a('string');
  });
});