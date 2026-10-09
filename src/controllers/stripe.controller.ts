import type { Context } from "hono";

import Stripe from "stripe";

import { requireEnv } from "../config/env";
import { paymentSchema } from "../schema/index";

let stripe: Stripe | undefined;

function getStripe() {
  stripe ??= new Stripe(requireEnv("STRIPE_KEY"), { apiVersion: "2022-08-01" });
  return stripe;
}

export async function createPayment(c: Context) {
  const { tokenId, amount } = paymentSchema.parse(await c.req.json());
  const charge = await getStripe().charges.create({ source: tokenId, amount, currency: "usd" });
  return c.json(charge);
}
