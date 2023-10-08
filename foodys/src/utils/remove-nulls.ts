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
    return undefined as any;
  }
  if (src === undefined) {
    return undefined as any;
  }
  if (Array.isArray(src)) {
    for (let i = 0; i < src.length; i++) {
      src[i] = removeNulls(src[i]);
    }
  } else if (src.constructor.name === "Object") {
    for (let key in src) {
      const val = src[key];
      if (val === null) {
        delete src[key];
      } else {
        src[key] = removeNulls(src[key]) as any;
      }
    }
  }

  return src as any;
}
