const db = require("../db/connection");
const format = require("pg-format");

exports.checkArticleExist = async (table_name, column_name, value) => {
  const queryStr = format(
    `SELECT * FROM %I WHERE %I = $1`,
    table_name,
    column_name
  );
  const result = await db.query(queryStr, [value]);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: `Not Found` });
  }
};
