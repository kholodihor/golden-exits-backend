import { Hono } from "hono";
import { checkAuth } from "../middleware/checkAuth";
import { UserController } from "../controllers/index.js";

export const authRoutes = new Hono()
  .post("/auth/register", UserController.register)
  .post("/auth/login", UserController.login)
  .get("/auth/user", checkAuth, UserController.getUser);
