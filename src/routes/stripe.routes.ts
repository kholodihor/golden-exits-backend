import { Hono } from "hono";

import { StripeController } from "../controllers/index";

export const stripeRoutes = new Hono().post(
  "/payment",
  StripeController.createPayment,
);
