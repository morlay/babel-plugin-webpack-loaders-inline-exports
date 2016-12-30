import * as vm from "vm";

const getExportsFromCodeString = (codeString: string): Object => {
  const module = {
    exports: {},
  };

  const code = `(function(require, module, exports) {
      ${codeString}
  })`;

  vm.runInThisContext(code, {
    filename: `${process.cwd()}/fixtures/index.js`,
  })(require, module, module.exports);

  return module.exports;
};

export default getExportsFromCodeString;
