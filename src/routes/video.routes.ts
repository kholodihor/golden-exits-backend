import { Hono } from "hono";

import { VideoController } from "../controllers/index";
import { checkAuth } from "../middleware/checkAuth";

export const videoRoutes = new Hono()
  .post("/videos", checkAuth, VideoController.uploadVideo)
  .patch("/videos/:id", VideoController.updateViews)
  .patch("/videos/:id/like", VideoController.likeVideo)
  .get("/videos", VideoController.getVideos);
