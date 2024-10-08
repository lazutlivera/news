const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const cors = require('cors');

const {
  getTopics,
  getEndpoints,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  patchArticle,
  deleteComment,
  getUsers,
} = require("./controllers/controller.js");
const {
  endPointNotFound,
  serverErrorHandler,
  handlePsqlErrors,
  customErrorHandler,
} = require("./err-handlers");

app.use(cors());

app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (res, req) =>{
  res.json({msg: "/api for endpoints"})
})
app.get("/api/*", endPointNotFound);

app.use(handlePsqlErrors);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
