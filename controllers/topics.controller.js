const app = require("../app");
const {
  fetchTopics,
  fetchEndpoints,
  fetchArticleById,
  fetchArticles,
  fetchComments,
  addComment,
  updateArticleVotes,
  deleteCommentById,
  fetchUsers,
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

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await fetchComments(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
exports.postComment = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  try {
    const comment = await addComment(article_id, username, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
exports.patchArticle = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  try {
    if (typeof inc_votes !== "number") {
      throw { status: 400, msg: "Invalid data type" };
    }

    const article = await updateArticleVotes(article_id, inc_votes);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
exports.deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await deleteCommentById(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
exports.getUsers = async (req, res, next) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};
