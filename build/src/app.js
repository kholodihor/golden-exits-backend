import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddlreware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { commentsRoutes } from "./routes/comments.routes.js";
import { newsRoutes } from "./routes/news.routes.js";
import { postRoutes } from "./routes/post.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { stripeRoutes } from "./routes/stripe.routes.js";
import { uploadsRoutes } from "./routes/uploads.routes.js";
import { videoRoutes } from "./routes/video.routes.js";
dotenv.config();
const app = new Hono();
connectDB();
app.use("*", logger());
app.use("*", cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
    credentials: true,
    maxAge: 3600,
}));
app.get("/", (c) => {
    return c.text("I`m alive!!!");
});
// Fix: Add leading slash to API routes
app.route("/api/", authRoutes);
app.route("/api/", commentsRoutes);
app.route("/api/", newsRoutes);
app.route("/api/", postRoutes);
app.route("/api/", productRoutes);
app.route("/api/", stripeRoutes);
app.route("/api/", uploadsRoutes);
app.route("/api/", videoRoutes);
app.onError((err, c) => {
    const error = errorHandler(c);
    return error;
});
app.notFound((c) => {
    const error = notFound(c);
    return error;
});
export default app;
