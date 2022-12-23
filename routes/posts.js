import { Router } from 'express';
const router = new Router();

import { checkAuth } from '../utils/index.js';

import { PostController } from '../controllers/index.js';

router.get('/posts', PostController.getAll);
router.get('/posts/:id', PostController.getOne);
router.post('/posts', checkAuth, PostController.create);
router.delete('/posts/:id', checkAuth, PostController.remove);
router.patch('/posts/:id', checkAuth, PostController.update);
router.patch('/posts/:id/like', PostController.likePost);
router.get('/posts/comments/:id', PostController.getPostComments)

export default router;
