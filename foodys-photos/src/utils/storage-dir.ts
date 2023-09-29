import path from "path";
import { STORAGE_PATH } from "../config/env.js";

const SAFE_SYMBOLS_RE = /^[0-9a-zA-Z_\-\.]*$/;

export function getOrigFilePath(photoReference: string) {
  if (!SAFE_SYMBOLS_RE.test(photoReference)) {
    throw new Error("unsafe symbols");
  }
  const subfolder = photoReference.slice(0, 2).toLowerCase();
  if (subfolder.length === 0) {
    throw new Error("failed to get subfolder");
  }
  const resourcePath = path.join(
    STORAGE_PATH,
    "orig",
    subfolder,
    photoReference + ".jpeg"
  );
  return resourcePath;
}

export function getConvertedFilePath(photoReference: string, preset: string) {
  if (!SAFE_SYMBOLS_RE.test(photoReference)) {
    throw new Error("unsafe symbols");
  }
  if (!SAFE_SYMBOLS_RE.test(preset)) {
    throw new Error("unsafe symbols");
  }
  const subfolder = photoReference.slice(0, 2).toLowerCase();
  if (subfolder.length === 0) {
    throw new Error("failed to get subfolder");
  }
  const resourcePath = path.join(
    STORAGE_PATH,
    "presets",
    preset,
    subfolder,
    photoReference + ".jpeg"
  );
  return resourcePath;
}
