import NewsModel from '../models/NewsModel.js';

export const createNews = async (req, res) => {
  try {
    const newArticle = new NewsModel({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
    });
    await newArticle.save();
    res.status(200).json(newArticle);
  } catch (error) {
    res.status(500).json({
      message: 'Fail to create an article',
    });
  }
};

export const getNews = async (req, res) => {
  try {
    const news= await NewsModel.find();
    res.status(200).json(news);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Can`t getnews',
    });
  }
};
