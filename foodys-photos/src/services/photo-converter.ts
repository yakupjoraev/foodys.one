import { GOOGLE_PLACES_API_KEY } from "../config/env.js";
import { PresetId, presets } from "../config/presets.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import createAtomicStream from "fs-write-stream-atomic";
import { pipeline } from "stream/promises";
import fetch from "node-fetch";
import { getConvertedFilePath, getOrigFilePath } from "../utils/storage-dir.js";

export class PlacesApiError extends Error {}

const taskIdToResult = new Map<string, Promise<string>>();

export async function convertPhoto(photoReference: string, preset?: PresetId) {
  const taskId = preset + ":" + photoReference;
  let task = taskIdToResult.get(taskId);
  if (task) {
    return task;
  }

  task = createConvertPhotoTask(photoReference, preset);

  task = task.finally(() => {
    taskIdToResult.delete(taskId);
  });

  taskIdToResult.set(taskId, task);

  return task;
}

async function createConvertPhotoTask(
  photoReference: string,
  preset?: PresetId
): Promise<string> {
  const origFilePath = getOrigFilePath(photoReference);

  const origExists = await checkAccess(origFilePath);

  if (!origExists) {
    await downloadPhotoFromGP(photoReference, origFilePath);
  }

  if (!preset) {
    return origFilePath;
  }

  const convertedFilePath = getConvertedFilePath(photoReference, preset);

  await convertPhotoByFile(origFilePath, convertedFilePath, preset);

  return convertedFilePath;
}

async function downloadPhotoFromGP(photoReference: string, outputPath: string) {
  const fileUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;

  const res = await fetch(fileUrl);

  if (!res.ok) {
    if (res.status === 403) {
      throw new PlacesApiError("quota has been exceeded");
    }
    throw new PlacesApiError("unexpected status code: " + res.status);
  }
  const contentType = res.headers.get("content-type");
  if (!contentType) {
    throw new PlacesApiError("content type required");
  }
  if (!/image\/(jpeg|png|webp)/.test(contentType)) {
    throw new PlacesApiError("uncepected content type: " + contentType);
  }

  const outputDir = path.dirname(outputPath);
  await fs.promises.mkdir(outputDir, { recursive: true });
  await pipeline(res.body, createAtomicStream(outputPath));
}

async function convertPhotoByFile(
  inputPath: string,
  outputPath: string,
  preset: PresetId
) {
  const outputDir = path.dirname(outputPath);
  await fs.promises.mkdir(outputDir, { recursive: true });
  const configureSharp = presets[preset];
  const inputStream = configureSharp(sharp(inputPath)).toFormat("jpeg");
  const outputStream = createAtomicStream(outputPath);
  await pipeline(inputStream, outputStream);
}

async function checkAccess(filePath: string) {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      throw error;
    }
  }
  return true;
}
