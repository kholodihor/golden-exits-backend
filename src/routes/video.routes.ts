import { Hono } from "hono";

import { VideoController } from "../controllers/index";
import { checkAuth } from "../middleware/checkAuth";

export const videoRoutes = new Hono()
  .post("/videos", checkAuth, VideoController.uploadVideo)
  .post("/videos/:id/views", VideoController.updateViews)
  .patch("/videos/:id/like", VideoController.likeVideo)
  .patch("/videos/:id", checkAuth, VideoController.updateVideo)
  .delete("/videos/:id", checkAuth, VideoController.deleteVideo)
  .get("/videos", VideoController.getVideos)
  .get("/videos/:id", VideoController.getVideoById);
