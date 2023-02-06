import { Router } from 'express';
import { NewsController } from '../controllers/index.js';

const router = new Router();

router.post('/news', NewsController.createNews);

router.get('/news', NewsController.getNews);

export default router;
