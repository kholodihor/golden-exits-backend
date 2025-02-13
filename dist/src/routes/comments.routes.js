import { Hono } from "hono";
import { CommentController } from "../controllers/index.js";
import { checkAuth } from "../middleware/checkAuth.js";
export const commentsRoutes = new Hono().post("/comments/:id", checkAuth, CommentController.createComment);
