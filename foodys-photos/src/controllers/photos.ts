import { Request, Response, NextFunction } from "express";
import ApiError from "../middlewares/error/ApiError.js";
import httpStatus from "http-status";
import { isPresetId } from "../config/presets.js";
import path from "path";
import { STORAGE_PATH } from "../config/env.js";
import {
  InputNotFoundError,
  UnsupportedOutputError,
  convertPhoto,
} from "../services/photo-converter.js";

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

  const handleConvertSuccess = (convertedFilePath: string) => {
    res.sendFile(convertedFilePath);
  };

  const handleConvertFailure = (error: any) => {
    if (!error) {
      return;
    }
    if (error instanceof InputNotFoundError) {
      return next(new ApiError(httpStatus.NOT_FOUND, "source not found"));
    } else if (error instanceof UnsupportedOutputError) {
      next(new ApiError(httpStatus.NOT_FOUND, "wrong extension"));
    } else {
      next(error);
    }
  };

  const handleExistsFileSent = (error: Error) => {
    if (!error) {
      return;
    }
    if (error && "code" in error && error.code === "ENOENT") {
      convertPhoto(photo, preset).then(
        handleConvertSuccess,
        handleConvertFailure
      );
    } else {
      next(error);
    }
  };

  const resourcePath = path.join(STORAGE_PATH, preset, photo);
  res.sendFile(resourcePath, handleExistsFileSent);
}
