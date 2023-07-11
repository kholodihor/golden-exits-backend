import { Router } from 'express';
const router = new Router();

import { checkAuth } from '../middleware/checkAuth.js';

import { CommentController } from '../controllers/index.js';

router.post('/comments/:id', checkAuth, CommentController.createComment);

export default router;
