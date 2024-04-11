// Remove readonly modifier from all properties as well as function members of an object
export type Plain<T> = {
  -readonly [K in keyof T]: T[K] extends (...args: any[]) => any
    ? never
    : T[K] extends Record<string, unknown>
    ? Plain<T[K]>
    : T[K];
};
