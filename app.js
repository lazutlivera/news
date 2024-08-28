const express = require("express");
const app = express();
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment
} = require("./controllers/topics.controller.js");
const {
  endPointNotFound,
  serverErrorHandler,
  handlePsqlErrors,
  customErrorHandler,
} = require("./err-handlers");

app.use(express.json());
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postComment)
app.get("/api/*", endPointNotFound);

app.use(handlePsqlErrors);
app.use(customErrorHandler);
app.use(serverErrorHandler);



module.exports = app;
