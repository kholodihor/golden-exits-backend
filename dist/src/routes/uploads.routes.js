import { Hono } from "hono";
import { UploadController } from "../controllers/index.js";
import { checkAuth } from "../middleware/checkAuth.js";
export const uploadsRoutes = new Hono()
    .post("/upload", checkAuth, UploadController.uploadImage)
    .post("/uploadvideo", checkAuth, UploadController.uploadVideo);
