import Stripe from "stripe";
import { requireEnv } from "../config/env.js";
import { paymentSchema } from "../schema/index.js";
let stripe;
function getStripe() {
    stripe ??= new Stripe(requireEnv("STRIPE_KEY"), { apiVersion: "2022-08-01" });
    return stripe;
}
export async function createPayment(c) {
    const { tokenId, amount } = paymentSchema.parse(await c.req.json());
    const charge = await getStripe().charges.create({ source: tokenId, amount, currency: "usd" });
    return c.json(charge);
}
