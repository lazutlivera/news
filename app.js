const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller.js");
const {
  serverErrorHandler,
  handlePsqlErrors,
  customErrorHandler,
} = require("./err-handlers");

app.get("/api/topics", getTopics);

app.use(handlePsqlErrors);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
