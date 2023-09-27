import { Request, Response, NextFunction } from "express";
import ApiError from "../middlewares/error/ApiError.js";
import httpStatus from "http-status";
import { isPresetId } from "../config/presets.js";
import path from "path";
import { API_SECRET, STORAGE_PATH } from "../config/env.js";
import {
  UnsupportedOutputError,
  convertPhoto,
} from "../services/photo-converter.js";
import { checkSignature } from "../utils/check-signature.js";

const PARAM_PRESET_RE = /^[a-z0-9_]+$/;
const PARAM_PHOTO_RE = /^[a-z0-9\.]+$/;

export function getPhoto(
  req: Request<{ preset: string; photo: string }>,
  res: Response,
  next: NextFunction
) {
  const { preset, photo } = req.params;
  if (!PARAM_PRESET_RE.test(preset)) {
    return next(new ApiError(httpStatus.NOT_FOUND, "preset: wrong symbols"));
  }
  if (!PARAM_PHOTO_RE.test(photo)) {
    return next(new ApiError(httpStatus.NOT_FOUND, "photo: wrong symbols"));
  }
  if (!isPresetId(preset)) {
    return next(new ApiError(httpStatus.NOT_FOUND, "preset: not found"));
  }

  const signature = req.query.signature;
  if (typeof signature !== "string") {
    return next(new ApiError(httpStatus.BAD_REQUEST, "signature required"));
  }
  if (!checkSignature(signature, preset + ":" + photo, API_SECRET)) {
    return next(new ApiError(httpStatus.FORBIDDEN, "wrong signature"));
  }

  const resourcePath = path.join(STORAGE_PATH, preset, photo);

  res.sendFile(resourcePath, (error) => {
    if (error && "code" in error && error.code === "ENOENT") {
      convertPhoto(photo, preset).then(
        (convertedFIlePath) => {
          res.sendFile(convertedFIlePath);
        },
        (error) => {
          if (error instanceof UnsupportedOutputError) {
            next(new ApiError(httpStatus.NOT_FOUND, "wrong extension"));
          } else {
            next(error);
          }
        }
      );
    } else {
      next(error);
    }
  });
}
