const db = require("../db/connection");
const fs = require("fs/promises");
const { checkArticleExist } = require("../utils/utils");
const comments = require("../db/data/test-data/comments");

exports.fetchTopics = async () => {
  let queryStr = `SELECT * FROM topics`;
  let queryVals = [];
  const result = await db.query(queryStr, queryVals);
  return result.rows;
};
exports.fetchEndpoints = async () => {
  const result = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8");
  const parsedResult = JSON.parse(result);
  return parsedResult;
};

exports.fetchArticleById = async (article_id) => {
  const queryStr = `SELECT * FROM articles WHERE article_id = $1`;
  const queryVal = [article_id];
  const result = await db.query(queryStr, queryVal);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: `Not Found` });
  } else {
    return result.rows[0];
  }
};
exports.fetchArticles = async () => {
  const queryStr =
    "SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id,articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC ";
  const result = await db.query(queryStr);
  return result.rows;
};
exports.fetchComments = async (article_id) => {
  let queryStr = "SELECT * FROM comments";
  let queryVals = [];
  let queryProms = [];

  if (article_id) {
    queryStr += " WHERE article_id = $1 ORDER BY comments.created_at DESC";
    queryVals.push(article_id);
    queryProms.push(checkArticleExist("articles", "article_id", article_id));
  }
  queryProms.push(db.query(queryStr, queryVals));
  const allPromises = await Promise.all(queryProms);
  if (queryProms.length === 1) {
    return allPromises[0].rows;
  } else {
    return allPromises[1].rows;
  }
};

exports.addComment = async (article_id, username, body) => {
  const queryStr = `INSERT INTO comments (article_id, author, body, created_at) VALUES($1, $2, $3, NOW()) RETURNING comment_id, article_id, author, body, created_at`;

  let queryVals = [];
  let queryProms = [];

  if (article_id) {
    if (!username || !body) {
      return Promise.reject({
        status: 400,
        msg: "username and comment required",
      });
    } else {
      queryVals.push(article_id, username, body);
      queryProms.push(checkArticleExist("articles", "article_id", article_id));
    }
  }
  queryProms.push(db.query(queryStr, queryVals));

  const allPromises = await Promise.all(queryProms);
  if (queryProms.length === 1) {
    return allPromises[0].rows;
  } else {
    return allPromises[1].rows[0];
  }
};
