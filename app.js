 

// app.use("/test", (req, res) => {
//   res.send("hello2");
// });

// app.get("/arpit", (req, res) => {
//   res.send("hello3");
// });

// app.use("/", (req, res) => {
//   res.send("hello1");
// });

// app.get("/user/:userId", (req, res) => {
//   console.log(req.params);
//   res.send({ name: "Arpit", lname: "jain" });
// });

// app.get(
//   "/user",
//   (req, res , next) => {
//     console.log(req.query);
//     res.send({ name: "Arpit", lname: "jain" });
//     // next();
//   },
//   (req, res) => {
//     console.log("2 response");
//     res.send("2nd response");
//   },
// );

// app.post("/user", (req, res) => {
//   //we ccan do anything here like saving of data into database

//   res.send("data savexd successfully");
// });

const { adminAuth } = require("./middlewares/auth");
app.get("/admin/getUser", adminAuth, (req, res) => {
  res.send("get user called");
});

app.get("/admin/deleteUser", adminAuth, (req, res) => {
  res.send("delete user called");
});

app.listen(3000, () => console.log("s/v started successfully"));
