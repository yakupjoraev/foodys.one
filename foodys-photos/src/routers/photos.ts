import { Router } from "express";
import { getPhoto } from "../controllers/photos.js";

export const photosRouter = Router();

photosRouter.get("/:preset/:photo", getPhoto);
