import { Context } from "hono";
import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const KEY = process.env.STRIPE_KEY || "";

export const createPayment = async (c: Context) => {
  const data = await c.req.json();
  //@ts-expect-error
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
      } else {
        c.status(200);
        throw new Error(stripeRes);
      }
    }
  );
};
