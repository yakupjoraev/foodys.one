import express from "express";
import * as morgan from "./middlewares/morgan.js";
import {
  ApiError,
  errorConverter,
  errorHandler,
} from "./middlewares/error/index.js";
import httpStatus from "http-status";
import { photosRouter } from "./routers/photos.js";

export const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use("/photos", photosRouter);

app.get("/status", (_req, res) => {
  res.json({ status: "OK" });
});

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
