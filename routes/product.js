import { Router } from 'express';
const router = new Router();

import { ProductController } from '../controllers/index.js';

router.post('/product', ProductController.createProduct);
router.get('/product/:id', ProductController.getProduct);
router.get('/products', ProductController.getAllProducts);

export default router;
