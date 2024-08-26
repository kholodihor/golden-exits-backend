import { Router } from 'express';
const router = new Router();

import { StripeController } from '../controllers/index.js';

router.post('/payment', StripeController.createPayment);

export default router;
