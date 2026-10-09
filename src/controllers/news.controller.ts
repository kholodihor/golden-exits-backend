import type { Context } from "hono";

import NewsModel from "../models/news.model";
import { createArticleSchema } from "../schema/index";

export async function createNews(c: Context) {
  const article = createArticleSchema.parse(await c.req.json());
  const newArticle = await NewsModel.create(article);
  return c.json(newArticle);
}

export async function getNews(c: Context) {
  const news = await NewsModel.find().lean();
  return c.json(news);
}
