import { Router } from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import cloudinary from '../libs/cloudinary.js';

const router = new Router();

router.post('/upload', checkAuth, async (req, res) => {
  const { image } = req.body;
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'posts',
    });
    res.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post('/uploadvideo', async (req, res) => {
  const { video } = req.body;
  try {
    const result = await cloudinary.uploader.upload(video, {
      resource_type: 'video',
      folder: 'videos',
    });
    res.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
