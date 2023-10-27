type WithoutNulls<T> = T extends null
  ? undefined
  : T extends Date
  ? T
  : {
      [K in keyof T]: T[K] extends (infer U)[]
        ? WithoutNulls<U>[]
        : WithoutNulls<T[K]>;
    };

export function removeNulls<T>(src: T): WithoutNulls<T> {
  if (src === null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
    return undefined as any;
  }
  if (src === undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
    return undefined as any;
  }
  if (Array.isArray(src)) {
    for (let i = 0; i < src.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      src[i] = removeNulls(src[i]);
    }
  } else if (src.constructor.name === "Object") {
    for (const key in src) {
      const val = src[key];
      if (val === null) {
        delete src[key];
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment,
        src[key] = removeNulls(src[key]) as any;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  return src as any;
}
