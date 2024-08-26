import { Hono } from "hono";
import { checkAuth } from "../middleware/checkAuth.js";
import { VideoController } from "../controllers/index.js";

export const videoRoutes = new Hono()
  .post("/videos", checkAuth, VideoController.uploadVideo)
  .patch("/videos/:id", VideoController.updateViews)
  .patch("/videos/:id/like", VideoController.likeVideo)
  .get("/videos", VideoController.getVideos);
