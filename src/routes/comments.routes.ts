import { Hono } from "hono";

import { CommentController } from "../controllers/index";
import { checkAuth } from "../middleware/checkAuth";

export const commentsRoutes = new Hono().post(
  "/comments/:id",
  checkAuth,
  CommentController.createComment,
);
