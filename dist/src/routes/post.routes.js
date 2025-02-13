import { Hono } from "hono";
import { PostController } from "../controllers/index.js";
import { checkAuth } from "../middleware/checkAuth.js";
export const postRoutes = new Hono()
    .get("/posts", PostController.getAllPosts)
    .get("/posts/:id", PostController.getOne)
    .post("/posts", checkAuth, PostController.create)
    .delete("/posts/:id", checkAuth, PostController.remove)
    .patch("/posts/:id", checkAuth, PostController.update)
    .patch("/posts/:id/like", PostController.likePost)
    .get("/posts/comments/:id", PostController.getPostComments);
