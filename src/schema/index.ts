import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(6),
  avatarUrl: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Please provide an email and password"),
  password: z.string().min(1, "Please provide an email and password"),
});

export const createPostSchema = z.object({
  title: z.string(),
  text: z.string(),
  imageUrl: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const createVideoSchema = z.object({
  title: z.string().max(50),
  url: z.string(),
  genre: z.string().optional(),
});

export const updateVideoSchema = createVideoSchema.partial();

export const createCommentSchema = z.object({
  comment: z.string().trim().min(1, "Comment can't be empty"),
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

export const paymentSchema = z.object({
  tokenId: z.string(),
  amount: z.number().int().positive(),
});

export const uploadImageSchema = z.object({ image: z.string().min(1) });

export const uploadVideoSchema = z.object({ video: z.string().min(1) });
