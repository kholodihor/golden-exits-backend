import { Hono } from "hono";

import { UserController } from "../controllers/index.js";
import { checkAuth } from "../middleware/checkAuth";

export const authRoutes = new Hono()
  .post("/auth/register", UserController.register)
  .post("/auth/login", UserController.login)
  .get("/auth/user", checkAuth, UserController.getUser);
