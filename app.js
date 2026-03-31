const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user created succefully");
  } catch (err) {
    console.log(err);
    res.send.status(500).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("db connected successfully");
    app.listen(7777, () => console.log("server is running on port 7777"));
  })
  .catch((err) => {
    console.log("db connection failed", err);
  });
