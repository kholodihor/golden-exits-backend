import { Hono } from "hono";
import { StripeController } from "../controllers/index.js";

export const stripeRoutes = new Hono().post(
  "/payment",
  StripeController.createPayment
);
