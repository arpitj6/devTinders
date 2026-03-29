const express = require("express");
const app = express();

const adminAuth = app.use("/admin", (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized user");
  }
});

module.exports = {adminAuth}
