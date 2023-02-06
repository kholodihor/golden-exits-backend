import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { corsOptions } from './config/corsOptions.js';

import videoRoute from './routes/video.js';
import postRoute from './routes/posts.js';
import newsRoute from './routes/news.js';
import commentRoute from './routes/comments.js';
import authRoute from './routes/auth.js';
import uploadRoute from './routes/uploads.js';
import productRoute from './routes/product.js';
import stripeRoute from './routes/stripe.js';

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

app.use(authRoute);
app.use(videoRoute);
app.use(postRoute);
app.use(newsRoute);
app.use(commentRoute);
app.use(uploadRoute);
app.use(productRoute);
app.use(stripeRoute);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT || 5000, (err) => {
      if (err) {
        return console.log(err);
      }

      console.log('Server and Database are OK');
    })
  )
  .catch((err) => console.log('DB error', err));
