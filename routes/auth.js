import { Router } from 'express';
const router = new Router();

import { checkAuth } from '../middleware/checkAuth.js';
import { registerValidation,loginValidation } from '../validations/index.js';

import { UserController } from '../controllers/index.js';

router.post('/auth/register', registerValidation, UserController.register);
router.post('/auth/login', loginValidation, UserController.login);

router.get('/auth/user', checkAuth, UserController.getUser);

export default router;
