import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middleware/errorMiddlreware";

import { authRoutes } from "./routes/auth.routes";
import { commentsRoutes } from "./routes/comments.routes";
import { newsRoutes } from "./routes/news.routes";
import { postRoutes } from "./routes/post.routes";
import { productRoutes } from "./routes/product.routes";
import { stripeRoutes } from "./routes/stripe.routes";
import { uploadsRoutes } from "./routes/uploads.routes";
import { videoRoutes } from "./routes/video.routes";

dotenv.config();

const app = new Hono();

connectDB();

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.get("/", (c) => {
  return c.text(process.env.MONGODB_URL!);
});

app.route("api/", authRoutes);
app.route("api/", commentsRoutes);
app.route("api/", newsRoutes);
app.route("api/", postRoutes);
app.route("api/", productRoutes);
app.route("api/", stripeRoutes);
app.route("api/", uploadsRoutes);
app.route("api/", videoRoutes);

app.onError((err, c) => {
  const error = errorHandler(c);
  return error;
});

app.notFound((c) => {
  const error = notFound(c);
  return error;
});

const port = parseInt(process.env.PORT!) || 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
