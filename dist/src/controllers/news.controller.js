import NewsModel from "../models/news.model.js";
import { createArticleSchema } from "../schema/index.js";
export async function createNews(c) {
    const article = createArticleSchema.parse(await c.req.json());
    const newArticle = await NewsModel.create(article);
    return c.json(newArticle);
}
export async function getNews(c) {
    const news = await NewsModel.find().lean();
    return c.json(news);
}
