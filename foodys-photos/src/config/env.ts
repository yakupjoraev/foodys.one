import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { expectInt, expectNodeEnv, expectString } from "../utils/expect-env.js";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

export const HOST = expectString("HOST");

export const PORT = expectInt("PORT");

export const API_SECRET = expectString("API_SECRET");

export const STORAGE_PATH = expectString("STORAGE_PATH");

export const GOOGLE_PLACES_API_KEY = expectString("GOOGLE_PLACES_API_KEY");

export const NODE_ENV = expectNodeEnv("NODE_ENV", "production");
