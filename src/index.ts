import * as path from "path";
import * as _ from "lodash";
import * as  ModuleFilenameHelpers from "webpack/lib/ModuleFilenameHelpers";

import {
  Node,
  CallExpression,
} from "babel-types";

import traverse, {
  NodePath,
} from "babel-traverse";

import {
  transform,
} from "babel-core";

import {
  Configuration,
  OldModule,
  NewModule,
  Rule,
} from "webpack";

import runWebpackSync from "./runWebpackSync";

const isJSFile = (filename: string) => {
  const test = /\.jsx?$/;
  return test.test(filename);
};

const isRequireCallExpression = (nodePath: NodePath<CallExpression>) => {
  const callee = nodePath.get("callee");
  return callee.isIdentifier() && callee.equals("name", "require");
};

const hasMatchedLoader = (filename: string, rules: Rule[]) =>
  _.reduce(
    rules,
    (result, rule) => result || ModuleFilenameHelpers.matchObject(rule, filename),
    false,
  );

const isFileNeedToProcess = (filename: string, rules: Rule[]) =>
  (!isJSFile(filename) && hasMatchedLoader(filename, rules));

const pickTheReturnOfWebpackResult = (ast: Node): Node => {
  let expr = null;

  traverse(ast, {
    AssignmentExpression(nodePath) {
      if (
        nodePath.parentPath.parentPath.isProgram() &&
        nodePath.get("left").get("object").equals("name", "module") &&
        nodePath.get("left").get("property").equals("name", "exports")
      ) {
        expr = nodePath.node.right;
      }
    },
  });

  return expr;
};

const resolveWebpackConfig = (configFile: string): Configuration => {
  const finalConfigFile = _.replace(configFile, /\$\{?PWD\}?/g, process.env.PWD);

  if (_.startsWith(finalConfigFile, "/")) {
    return require(finalConfigFile);
  }

  return require(path.join(process.cwd(), configFile));
};

export default () => ({
  visitor: {
    CallExpression(nodePath: NodePath<CallExpression>, { opts, file }: { opts: { configFile: string }, file: any }) {
      if (isRequireCallExpression(nodePath)) {
        const arg = (nodePath.get("arguments") as any)[0];
        const filename = file.opts.filename;
        const targetFilename = arg.node.value;
        const webpackConfig = opts.configFile ? resolveWebpackConfig(opts.configFile) : opts;

        const loaders = webpackConfig.module
          ? ((webpackConfig.module as NewModule).rules || (webpackConfig.module as OldModule).loaders)
          : [];

        if (arg && arg.isStringLiteral() && isFileNeedToProcess(targetFilename, loaders)) {
          const finalTargetFileName = path.resolve(path.dirname(filename), targetFilename);

          const webpackResult = runWebpackSync(finalTargetFileName, webpackConfig);

          if (webpackResult.length === 0) {
            return;
          }
          const webpackResultAst = transform(webpackResult).ast;
          const pickedWebpackExpr = pickTheReturnOfWebpackResult(webpackResultAst);

          if (pickedWebpackExpr !== null) {
            nodePath.replaceWith(pickedWebpackExpr);
          }
        }
      }
    },
  },
});
