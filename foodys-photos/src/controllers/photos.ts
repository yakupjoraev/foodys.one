import { Request, Response, NextFunction } from "express";
import ApiError from "../middlewares/error/ApiError.js";
import httpStatus from "http-status";
import { isPresetId } from "../config/presets.js";
import { convertPhoto } from "../services/photo-converter.js";
import { getConvertedFilePath, getOrigFilePath } from "../utils/storage-dir.js";

const PARAM_PRESET_RE = /^[a-z0-9_]+$/;
const PARAM_PHOTO_REFERENCE_RE = /^[a-zA-Z0-9\-_]+$/;

export function getPhoto(
  req: Request<{ preset: string; photo_reference: string }>,
  res: Response,
  next: NextFunction
) {
  const { preset, photo_reference } = req.params;
  if (!PARAM_PRESET_RE.test(preset)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "preset: wrong symbols"));
  }
  if (!PARAM_PHOTO_REFERENCE_RE.test(photo_reference)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "photo: wrong symbols"));
  }
  if (photo_reference.length < 3) {
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        "photo_reference: at least 3 symbols required"
      )
    );
  }
  if (!isPresetId(preset) && preset !== "orig") {
    return next(new ApiError(httpStatus.NOT_FOUND, "preset: not found"));
  }

  const handleConvertSuccess = (convertedFilePath: string) => {
    res.type("image/jpeg").sendFile(convertedFilePath);
  };

  const handleConvertFailure = (error: any) => {
    next(error);
  };

  const handleExistsFileSent = (error: Error) => {
    if (!error) {
      return;
    }
    if (error && "code" in error && error.code === "ENOENT") {
      convertPhoto(
        photo_reference,
        preset === "orig" ? undefined : preset
      ).then(handleConvertSuccess, handleConvertFailure);
    } else {
      next(error);
    }
  };

  const resourcePath =
    preset === "orig"
      ? getOrigFilePath(photo_reference)
      : getConvertedFilePath(photo_reference, preset);

  res.sendFile(resourcePath, handleExistsFileSent);
}
