import { STORAGE_PATH } from "../config/env.js";
import { PresetId, presets } from "../config/presets.js";
import sharp from "sharp";
import path from "path";

export class UnsupportedOutputError extends Error {}

const taskIdToResult = new Map<string, Promise<string>>();

export async function convertPhoto(fileName: string, preset: PresetId) {
  const taskId = preset + ":" + fileName;
  let task = taskIdToResult.get(taskId);
  if (task) {
    return task;
  }

  task = createConvertPhotoTask(fileName, preset);

  task = task.finally(() => {
    taskIdToResult.delete(taskId);
  });

  taskIdToResult.set(taskId, task);

  return task;
}

async function createConvertPhotoTask(
  fileName: string,
  preset: PresetId
): Promise<string> {
  const fileNameParsed = parseFileName(fileName);
  if (fileNameParsed.output === null) {
    throw new UnsupportedOutputError();
  }
  const output = fileNameParsed.output;
  const input = fileNameParsed.input || "jpeg";
  const base = fileNameParsed.base;

  const origPath = path.join(STORAGE_PATH, "orig", base + "." + input);
  const outputPath = path.join(STORAGE_PATH, preset, base + "." + output);
  const configureSharp = presets[preset];

  return new Promise<string>((resolve, reject) => {
    configureSharp(sharp(origPath), output).toFile(outputPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(outputPath);
      }
    });
  });
}

function parseFileName(fileName: string): {
  base: string;
  input: "jpeg" | null;
  output: "jpeg" | null;
} {
  let inputType: "jpeg" | null = null;
  let outputType: "jpeg" | null = null;
  const typeMatches = fileName.match(/(|_(?:jpeg))\.(jpeg)$/);
  if (typeMatches === null) {
    return { base: fileName, input: inputType, output: outputType };
  }
  if (typeMatches[1] === "jpeg") {
    inputType = "jpeg";
  }
  if (typeMatches[2] === "jpeg") {
    outputType = "jpeg";
  }

  let suffixLength = 0;
  if (inputType !== null) {
    suffixLength = inputType.length + 1;
  }
  if (outputType !== null) {
    suffixLength = outputType.length + 1;
  }

  const baseName = fileName.slice(-suffixLength);

  return {
    base: baseName,
    input: inputType,
    output: outputType,
  };
}
