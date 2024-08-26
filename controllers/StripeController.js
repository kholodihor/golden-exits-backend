import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const KEY = process.env.STRIPE_KEY;

export const createPayment = (req, res) => {
  stripe(KEY).charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
};
