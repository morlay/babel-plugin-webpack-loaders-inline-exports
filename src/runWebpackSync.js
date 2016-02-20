import path from 'path';
import webpack from 'webpack';
import deasync from 'deasync';
import MemoryFS from 'memory-fs';

const runWebpackSync = (filename, webpackConfig) => {
  let result;

  const fs = new MemoryFS();
  const destDir = path.join(__dirname, '../temp');
  const name = 'result.js';

  const compiler = webpack({
    ...webpackConfig,
    entry: filename,
    output: {
      ...webpackConfig.output,
      libraryTarget: 'commonjs2',
      path: destDir,
      filename: name
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
  });

  compiler.outputFileSystem = fs;

  compiler.run((err) => {
    if (err) {
      throw err;
    }
    result = String(fs.readFileSync(path.join(destDir, name)));
  });

  deasync.loopWhile(() => result === undefined);

  return result;
};

export default runWebpackSync;