import NewsModel from "../models/news.model.js";
import { createArticleSchema } from "../schema/index.js";
export async function createNews(c) {
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
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Failed to create an article");
    }
}
export async function getNews(c) {
    try {
        const news = await NewsModel.find().lean().exec();
        if (!news) {
            c.status(404);
            return c.json({ message: "No articles found" });
        }
        c.status(200);
        return c.json(news);
    }
    catch (err) {
        console.error("Error fetching articles:", err);
        c.status(500);
        return c.json({
            message: "Failed to get articles",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}
