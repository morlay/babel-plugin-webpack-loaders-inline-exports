import path from 'path';
import _ from 'lodash';
import ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers';
import runWebpackSync from './runWebpackSync';

const isJSFile = (filename) => {
  const test = /\.jsx?$/;
  return test.test(filename);
};

const isRequireCallExpression = (nodePath) => {
  const callee = nodePath.get('callee');
  return callee.isIdentifier() && callee.equals('name', 'require');
};

const hasMatchedLoader = (filename, loaders) =>
  _.reduce(
    loaders,
    (result, loaderObj) => result || ModuleFilenameHelpers.matchObject(loaderObj, filename),
    false
  );

const isFileNeedToProcess = (filename, loaders) =>
  (!isJSFile(filename) && hasMatchedLoader(filename, loaders));

const pickTheReturnOfWebpackResult = (traverse, ast) => {
  let expr = null;

  traverse(ast, {
    AssignmentExpression(nodePath) {
      if (
        nodePath.parentPath.parentPath.isProgram() &&
        nodePath.get('left').get('object').equals('name', 'module') &&
        nodePath.get('left').get('property').equals('name', 'exports')
      ) {
        expr = nodePath.node.right;
      }
    },
  });

  return traverse.removeProperties(expr);
};

const resolveWebpackConfig = (options) => {
  /* eslint global-require: 0 */
  const webpackConfig = options.config
    ? require(path.join(process.cwd(), options.config))
    : {};

  return {
    ...webpackConfig,
    ...(_.omit(options, 'config')),
  };
};

export default ({ traverse, transform }) => ({
  visitor: {
    CallExpression(nodePath, { opts, file }) {
      if (isRequireCallExpression(nodePath)) {
        const arg = nodePath.get('arguments')[0];
        const filename = file.opts.filename;
        const targetFilename = arg.node.value;
        const webpackConfig = resolveWebpackConfig(opts);
        const loaders = webpackConfig.module ? webpackConfig.module.loaders : [];

        if (arg && arg.isStringLiteral() && isFileNeedToProcess(targetFilename, loaders)) {
          const finalTargetFileName = path.resolve(path.dirname(filename), targetFilename);
          const webpackResult = runWebpackSync(finalTargetFileName, webpackConfig);
          if (webpackResult.length === '0') {
            return;
          }
          const webpackResultAst = transform(webpackResult).ast;
          const pickedWebpackExpr = pickTheReturnOfWebpackResult(traverse, webpackResultAst);

          if (pickedWebpackExpr !== null) {
            nodePath.replaceWith(pickedWebpackExpr);
          }
        }
      }
    },
  },
});
