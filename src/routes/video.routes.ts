import { Hono } from "hono";

import { VideoController } from "../controllers/index";
import { checkAuth } from "../middleware/checkAuth";

export const videoRoutes = new Hono()
  .post("/videos", checkAuth, VideoController.uploadVideo)
  .post("/videos/:id/views", VideoController.updateViews) // Changed to POST for views increment
  .patch("/videos/:id/like", VideoController.likeVideo)
  .get("/videos", VideoController.getVideos)
  .get("/videos/:id", VideoController.getVideoById);
