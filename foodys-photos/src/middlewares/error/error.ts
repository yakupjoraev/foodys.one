import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "./ApiError.js";
import { NODE_ENV } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;
    const message: string = error.message || `${httpStatus[statusCode]}`;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let { statusCode, message } = err;
  if (NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
  }

  res.locals["errorMessage"] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  };

  if (NODE_ENV === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
