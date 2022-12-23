import { Router } from 'express';
const router = new Router();

import { checkAuth } from '../utils/index.js';

import { UserController } from '../controllers/index.js';

router.post('/auth/login', UserController.login);
router.post('/auth/register', UserController.register);

router.get('/auth/user', checkAuth, UserController.getUser);

export default router;
