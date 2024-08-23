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
