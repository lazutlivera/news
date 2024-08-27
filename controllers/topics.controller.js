const app = require("../app");
const {
  fetchTopics,
  fetchEndpoints,
  fetchArticleById,
  fetchArticles,
} = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getEndpoints = async (req, res, next) => {
  try {
    const endPoints = await fetchEndpoints();
    res.status(200).send({ endPoints });
  } catch (err) {
    next(err);
  }
};
exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await fetchArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
exports.getArticles = async (req, res, next) => {
  const articles = await fetchArticles();
  res.status(200).send({ articles });
};
