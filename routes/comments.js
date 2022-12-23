import { Router } from 'express';
import { checkAuth } from '../utils/index.js';
import { CommentController } from '../controllers/index.js';

const router = new Router();

router.post('/comments/:id', checkAuth, CommentController.createComment);

export default router;
