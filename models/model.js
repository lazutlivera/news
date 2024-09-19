const db = require("../db/connection");
const fs = require("fs/promises");
const { checkExist } = require("../utils/utils");
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
  const queryStr = `SELECT articles.article_id,articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, articles.body ,CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id,articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, articles.body`;
  const queryVal = [article_id];
  const result = await db.query(queryStr, queryVal);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: `Not Found` });
  } else {
    return result.rows[0];
  }
};
exports.fetchArticles = async (sort_by, order, topic) => {
  let queryStr =
    "SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.body) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";
  const groupStr = ` GROUP BY articles.article_id,articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url`
  const validSorts = ["title", "topic", "author", "votes", "comment_count", "created_at"];
  const validOrders = ["desc", "asc"];
  const validTopics =["coding", "football", "cooking", "cats"]

  if (topic || topic === "") {
    if (!validTopics.includes(topic)) {
      return Promise.reject({ status: 400, msg: "Invalid Topic" });
    } else {
      queryStr += ` WHERE articles.topic = '${topic}'` + groupStr;
    }
  }else if (sort_by || sort_by === "") {
    if (!validSorts.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid Sort" });
    } else {
      queryStr += groupStr +` ORDER BY ${sort_by}`;
      if (order || order === "") {
        if (!validOrders.includes(order)) {
          return Promise.reject({ status: 400, msg: "Invalid Order Command" });
        } else {
          queryStr += ` ${order}`;
        }
      } else {
        queryStr += ` DESC`;
      }
    }
  } else {
    queryStr += groupStr +` ORDER BY articles.created_at DESC`;
  }

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
    queryProms.push(checkExist("articles", "article_id", article_id));
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
      queryProms.push(checkExist("articles", "article_id", article_id));
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
exports.updateArticleVotes = async (article_id, inc_votes) => {
  await checkExist("articles", "article_id", article_id);

  const queryStr = `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
  `;
  const queryValues = [inc_votes, article_id];

  const result = await db.query(queryStr, queryValues);

  return result.rows[0];
};
exports.deleteCommentById = async (comment_id) => {
  await checkExist("comments", "comment_id", comment_id);

  const queryStr = `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
  `;
  const queryValues = [comment_id];

  const result = await db.query(queryStr, queryValues);

  return result.rows[0];
};
exports.fetchUsers = async () => {
  const queryStr = `SELECT * FROM users`;
  const result = await db.query(queryStr);
  return result.rows;
};
