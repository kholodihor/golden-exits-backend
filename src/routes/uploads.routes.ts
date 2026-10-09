import { Hono } from "hono";

import { UploadController } from "../controllers/index";
import { checkAuth } from "../middleware/checkAuth";

export const uploadsRoutes = new Hono()
  .post("/upload", checkAuth, UploadController.uploadImage)
  .post("/uploadvideo", checkAuth, UploadController.uploadVideo);
