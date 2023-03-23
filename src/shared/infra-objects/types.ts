export type OmitMethods<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
  }[keyof T]
>;

export type Plain<T> = {
  -readonly [K in keyof OmitMethods<T>]: T[K] extends Record<string, any>
    ? Plain<T[K]>
    : T[K];
};
