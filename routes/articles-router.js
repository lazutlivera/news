const { getArticles, getArticleById, patchArticle, getCommentsByArticleId, postComment } = require("../controllers/controller");


const articlesRouter = require("express").Router();

articlesRouter
  .route("/")
  .get(getArticles)
  .post((req, res) => {
    res.status(200).send("All OK from POST /api/users");
  })
  .patch((req, res) => {
    res.status(200).send("All OK from PATCH /api/users");
  });

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment)
module.exports = articlesRouter;