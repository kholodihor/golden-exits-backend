import { Hono } from "hono";
import { ProductController } from "../controllers/index.js";

export const productRoutes = new Hono()
  .post("/product", ProductController.createProduct)
  .get("/product/:id", ProductController.getProduct)
  .get("/products", ProductController.getAllProducts);
