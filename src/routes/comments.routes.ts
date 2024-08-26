import { Hono } from "hono";
import { checkAuth } from "../middleware/checkAuth.js";
import { CommentController } from "../controllers/index.js";

export const commentsRoutes = new Hono().post(
  "/comments/:id",
  checkAuth,
  CommentController.createComment
);
