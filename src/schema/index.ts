import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string(),
  text: z.string(),
  imageUrl: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const createVideoSchema = z.object({
  title: z.string(),
  url: z.string(),
  genre: z.string(),
  likes: z.any(),
  views: z.number(),
  user: z.string(),
});

export const createCommentSchema = z.object({
  comment: z.string(),
  user: z.string(),
});

export const createArticleSchema = z.object({
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
});

export const createProductSchema = z.object({
  title: z.string(),
  category: z.string(),
  gender: z.string(),
  img: z.string(),
  price: z.number(),
});
