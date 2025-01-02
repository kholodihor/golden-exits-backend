import type { Context } from "hono";

import dotenv from "dotenv";
import stripe from "stripe";

dotenv.config();

const KEY = process.env.STRIPE_KEY || "";

export async function createPayment(c: Context) {
  const data = await c.req.json();
  // @ts-expect-error - Stripe types don't match exactly with our implementation but it works correctly
  stripe(KEY).charges.create(
    {
      source: data.tokenId,
      amount: data.amount,
      currency: "usd",
    },
    (stripeErr: any, stripeRes: any) => {
      if (stripeErr) {
        console.log(stripeErr);
        c.status(500);
        throw new Error(stripeErr);
      }
      else {
        c.status(200);
        throw new Error(stripeRes);
      }
    },
  );
}
