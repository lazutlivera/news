const db = require("../db/connection");

exports.fetchTopics = async () => {
  let queryStr = `SELECT * FROM topics`;
  let queryVals = [];

  const result = await db.query(queryStr, queryVals);
  console.log('you are here')

  return result.rows;
};
