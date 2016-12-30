declare module "deasync" {
  function deasync(fn: Function): Function;

  namespace deasync {
    export function sleep(): void;

    export function runLoopOnce(): void;

    export function loopWhile(fn: Function): void;
  }

  export = deasync;
}