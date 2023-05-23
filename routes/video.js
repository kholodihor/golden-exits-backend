import { Router } from 'express';
const router = new Router();

import { VideoController } from '../controllers/index.js';

import { checkAuth } from '../utils/checkAuth.js';

router.post('/videos', checkAuth, VideoController.uploadVideo);
router.patch('/videos/:id', VideoController.updateViews);
router.patch('/videos/:id/like', VideoController.likeVideo);
router.get('/videos', VideoController.getVideos);

export default router;
