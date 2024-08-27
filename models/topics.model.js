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
  let queryStr = `SELECT * FROM articles WHERE article_id = $1`;
  let queryVal = [article_id];
  const result = await db.query(queryStr, queryVal);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: `Id ${article_id} Not Found`});
  } else {
    return result.rows[0];
  }
};
