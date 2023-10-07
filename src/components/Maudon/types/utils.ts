export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export type BrowserNativeObject = Date | FileList | File;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;

export type DeepPartial<T> = T extends BrowserNativeObject ? T : { [K in keyof T]?: DeepPartial<T[K]> };
