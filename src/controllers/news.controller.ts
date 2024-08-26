import { Context } from "hono";
import NewsModel from "../models/news.model";
import { createArticleSchema } from "../schema";

export const createNews = async (c: Context) => {
  try {
    const data = await c.req.json();
    const article = createArticleSchema.parse(data);
    const newArticle = new NewsModel({
      title: article.title,
      content: article.content,
      imageUrl: article.imageUrl,
    });
    await newArticle.save();
    c.status(200);
    return c.json(newArticle);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to create an article");
  }
};

export const getNews = async (c: Context) => {
  try {
    const news = await NewsModel.find();
    c.status(200);
    return c.json(news);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to get articles");
  }
};
