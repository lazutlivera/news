const db = require("../db/connection");
const fs = require("fs/promises");

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
 const queryStr = "SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id,articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC ";
  const result = await db.query(queryStr);
  return result.rows;
};
