export function removeUndefined<T>(src: T): T {
  if (src === null) {
    return undefined as any;
  }
  if (src === undefined) {
    return undefined as any;
  }
  if (Array.isArray(src)) {
    for (let i = 0; i < src.length; i++) {
      src[i] = removeUndefined(src[i]);
    }
  } else if (src.constructor.name === "Object") {
    for (let key in src) {
      const val = src[key];
      if (val === undefined) {
        delete src[key];
      } else {
        src[key] = removeUndefined(src[key]) as any;
      }
    }
  }

  return src as any;
}
