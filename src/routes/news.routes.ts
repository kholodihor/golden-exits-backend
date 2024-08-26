import { Hono } from "hono";
import { NewsController } from "../controllers/index.js";

export const newsRoutes = new Hono()
  .post("/news", NewsController.createNews)
  .get("/news", NewsController.getNews);
