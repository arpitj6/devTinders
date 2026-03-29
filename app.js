const express = require("express");
const app = express();


app.use("/test", (req, res) => {
  res.send("hello2");
});

app.get("/arpit", (req, res) => {
  res.send("hello3");
});

app.use("/", (req, res) => {
  res.send("hello1");
});

app.listen(3000, () => console.log("s/v started successfully"));
