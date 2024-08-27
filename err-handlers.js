exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid info" });
  } else {
    next(err);
  }
};

exports.endPointNotFound = (req, res, next) => {
  const url = req.originalUrl
    res.status(404).send({ msg: `Endpoint ${url} Not Found` });
  };

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
