import type { Context } from "hono";

import { HTTPException } from "hono/http-exception";
import mongoose from "mongoose";
import Stripe from "stripe";

import { requireEnv } from "../config/env";
import ProductModel from "../models/product.model";
import { paymentSchema } from "../schema/index";

let stripe: Stripe | undefined;

function getStripe() {
  stripe ??= new Stripe(requireEnv("STRIPE_KEY"), { apiVersion: "2022-08-01" });
  return stripe;
}

// Prices come from the database, so the charged amount can't be set by the client.
async function priceCartInCents(items: { productId: string; quantity: number }[]) {
  const quantities = new Map<string, number>();
  for (const { productId, quantity } of items) {
    if (!mongoose.isValidObjectId(productId)) {
      throw new HTTPException(400, { message: `Invalid product id: ${productId}` });
    }
    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
  }

  const products = await ProductModel.find({ _id: { $in: [...quantities.keys()] } })
    .select("price")
    .lean();
  if (products.length !== quantities.size) {
    throw new HTTPException(400, { message: "One or more products no longer exist" });
  }

  return products.reduce(
    (total, product) =>
      total + Math.round(product.price * 100) * quantities.get(product._id.toString())!,
    0,
  );
}

export async function createPayment(c: Context) {
  const { tokenId, items } = paymentSchema.parse(await c.req.json());
  const amount = await priceCartInCents(items);

  const charge = await getStripe().charges.create({ source: tokenId, amount, currency: "usd" });
  return c.json({ success: true, id: charge.id, amount: charge.amount, status: charge.status });
}
