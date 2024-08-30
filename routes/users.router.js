const { getUsers } = require("../controllers/controller");

const usersRouter = require("express").Router();
usersRouter
  .route("/")
  .get(getUsers)

  module.exports = usersRouter;
