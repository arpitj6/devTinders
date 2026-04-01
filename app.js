const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignUpData } = require("./validation.js");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

//create user
app.post("/signup", async (req, res) => {
  // const user = new User(req.body);
  try {
    // validate the data before saving into db
    validateSignUpData(req);

    const { firstName, lastName, emailId, password, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
    });

    await user.save();
    res.send("user created succefully");
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR : " + err?.message);
  }
});

// get user by emailid
app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ emailId: req.body.emailId });
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(400).send("something wentw wrong !");
  }
});

//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users?.length) {
      res.send(users);
    } else {
      res.send("users not found");
    }
  } catch (err) {
    res.status(400).send("something went wromg");
  }
});

//delete user by id
app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body?.userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// update user by id
app.patch("/user/:userId", async (req, res) => {
  try {
    const data = req.body;
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "skills",
      "age",
      "gender",
      "emailId",
      "password",
    ];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isUpdateAllowed) {
      throw new Error("updates not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("skills cant be more than 10");
    }

    const user = await User.findByIdAndUpdate(req.params?.userId, req.body, {
      runValidators: true,
    });
    res.send("user update successfully!");
  } catch (err) {
    console.log(err);
    res.status(400).send("something went wrong!  " + err.message);
  }
});

//login user api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // check if email id is predent or not
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("invalid credentials!");
    }

    //check for password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(isValidPassword);
    if (isValidPassword) {
      res.send("login successful!");
    } else {
      throw new Error("invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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
