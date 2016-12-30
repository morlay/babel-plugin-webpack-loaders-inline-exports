declare module "webpack/lib/ModuleFilenameHelpers" {
  const ModuleFilenameHelpers: {
    matchObject(obj: Object, filename: string): boolean;
  };

  export = ModuleFilenameHelpers;
}