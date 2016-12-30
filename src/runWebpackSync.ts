import * as path from "path";
import * as webpack from "webpack";
import * as deasync from "deasync";
import * as _ from "lodash";
import * as MemoryFS from "memory-fs";

import {
  Configuration,
  Plugin,
} from "webpack";

interface IPlugin extends Plugin {
  new (): IPlugin;
}

const unnecessaryPluginList = _.values<IPlugin>(webpack.optimize);

const isPluginInstanceOf = (plugins: IPlugin[], targetPlugin: IPlugin) =>
  _.reduce(plugins, (result, TargetPlugin: IPlugin) => result || (targetPlugin instanceof TargetPlugin), false);

const removeUnnecessaryPlugins = (plugins: IPlugin[]) =>
  _.filter(
    plugins,
    (pluginInstance) => !isPluginInstanceOf(unnecessaryPluginList, pluginInstance),
  );

const runWebpackSync = (filename: string, webpackConfig: Configuration) => {
  let result: string;

  const fs = new MemoryFS();
  const destDir = path.join(__dirname, "../temp");
  const name = "result.js";

  const compiler = webpack({
    ..._.omit(webpackConfig, "devtool"),
    entry: filename,
    plugins: removeUnnecessaryPlugins(webpackConfig.plugins as IPlugin[]),
    output: {
      ...webpackConfig.output,
      libraryTarget: "commonjs2",
      path: destDir,
      filename: name,
    },
    externals: [
      (context, subRequest, callback: (err?: any, request?: any) => void) => {
        if (subRequest !== filename) {
          return callback(null, subRequest);
        }
        return callback();
      },
    ],
  });

  compiler.outputFileSystem = fs;

  compiler.run((err: any) => {
    if (err) {
      throw err;
    }

    const resultFilename = path.join(destDir, name);

    if (fs.existsSync(resultFilename)) {
      result = String(fs.readFileSync(resultFilename));
    } else {
      result = "";
    }
  });

  deasync.loopWhile(() => result === undefined);

  return result;
};

export default runWebpackSync;
