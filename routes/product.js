import { Router } from 'express';
const router = new Router();

// import { checkAuth } from '../utils/index.js';

import { ProductController } from '../controllers/index.js';

router.post('/product', ProductController.create);

router.get('/product/:id', ProductController.getProduct);

router.get('/products', ProductController.getAllProducts);

export default router;
