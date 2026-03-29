const express = require("express");
const app = express();

// app.use("/test", (req, res) => {
//   res.send("hello2");
// });

// app.get("/arpit", (req, res) => {
//   res.send("hello3");
// });

// app.use("/", (req, res) => {
//   res.send("hello1");
// });

app.get("/user/:userId", (req, res) => {
    console.log(req.params)
  res.send({ name: "Arpit", lname: "jain" });
});

app.get("/user", (req, res) => {
    console.log(req.query)
  res.send({ name: "Arpit", lname: "jain" });
});

app.post("/user", (req, res) => {
  //we can do anything here like saving of data into database

  res.send("data savexd successfully");
});

app.listen(3000, () => console.log("s/v started successfully"));
