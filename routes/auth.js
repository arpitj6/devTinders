const express = require("express");

const authRouter = express.Router();
const User = require("../model/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
authRouter.get("/", async (req, res) => {
  try {
    res.json({ message: "Welcome to DevTinder API" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//create user
authRouter.post("/signup", async (req, res) => {
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

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    res.cookie("token", token, { httpOnly: true, secure: true });
    res
      .status(201)
      .json({ message: "user created successfully", data: savedUser });
  } catch (err) {
    res.status(500).send("ERROR : " + err?.message);
  }
});

//login user api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).send("Email and password required");
    }

    // check if email id is predent or not
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    //check for password
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      //create json web token (jwt)
      const token = await user.getJWT();
      res.cookie("token", token, { httpOnly: true, secure: true });
      res.send(user);
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err?.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).json({ message: "user logged out successfully" });
});

module.exports = authRouter;
