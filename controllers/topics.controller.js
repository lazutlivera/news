const app = require("../app");
const { fetchTopics, fetchEndpoints } = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getEndpoints = async (req, res, next) => {
  try {
    const endPoints = await fetchEndpoints();
    res.status(200).send({ endPoints });
  } catch (err) {
    next(err);
  }
};

