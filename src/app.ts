import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import process from "node:process";

import { connectDB } from "./config/db";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import { authRoutes } from "./routes/auth.routes";
import { commentsRoutes } from "./routes/comments.routes";
import { newsRoutes } from "./routes/news.routes";
import { postRoutes } from "./routes/post.routes";
import { productRoutes } from "./routes/product.routes";
import { stripeRoutes } from "./routes/stripe.routes";
import { uploadsRoutes } from "./routes/uploads.routes";
import { videoRoutes } from "./routes/video.routes";

connectDB().catch((err) => {
  console.error(`MongoDB connection error: ${err.message}`);
  process.exit(1);
});

const app = new Hono();

app.use("*", logger());

app.use(
  "*",
  cors({
    // Comma-separated list of allowed origins; defaults to any origin.
    origin: process.env.CORS_ORIGIN?.split(",").map(o => o.trim()) ?? "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 3600,
  }),
);

app.get("/", c => c.text("I`m alive!!!"));

const routes = [
  authRoutes,
  commentsRoutes,
  newsRoutes,
  postRoutes,
  productRoutes,
  stripeRoutes,
  uploadsRoutes,
  videoRoutes,
];
for (const route of routes) {
  app.route("/api", route);
}

app.onError(errorHandler);
app.notFound(notFound);

export default app;
