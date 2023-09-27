import { STORAGE_PATH } from "../config/env.js";
import { PresetId, presets } from "../config/presets.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import createAtomicStream from "fs-write-stream-atomic";
import { pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

export class InputNotFoundError extends Error {}

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
  const base = fileNameParsed.base;
  const input = fileNameParsed.input || "jpeg";
  const output = fileNameParsed.output;

  const inputPath = path.join(STORAGE_PATH, "orig", base + "." + input);
  const outputDir = path.join(STORAGE_PATH, preset);
  const outputPath = path.join(outputDir, base + "." + output);
  const configureSharp = presets[preset];

  try {
    await fs.promises.access(inputPath, fs.constants.R_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new InputNotFoundError();
    }
    throw error;
  }
  
  await fs.promises.mkdir(path.join(STORAGE_PATH, preset), { recursive: true });
  const sharpStream = configureSharp(sharp(inputPath), output);
  const outputStream = createAtomicStream(outputPath);
  await pipelineAsync(sharpStream, outputStream);

  return outputPath;
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

  const baseName = fileName.slice(0, -suffixLength);

  return {
    base: baseName,
    input: inputType,
    output: outputType,
  };
}
