import morgan from "morgan";
import { Request, Response } from "express";
import { logger } from "../config/logger.js";
import { NODE_ENV } from "../config/env.js";

morgan.token(
  "message",
  (_req: Request, res: Response) => res.locals["errorMessage"] || ""
);

const getIpFormat = () => (NODE_ENV === "production" ? ":remote-addr - " : "");
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message: string) => logger.error(message.trim()) },
});
