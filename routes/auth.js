const express = require("express");

const authRouter = express.Router();
const User = require("../model/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

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
    res.cookie("token", token);
    res.json({ message: "user created successfully", data: savedUser });
  } catch (err) {
    console.log(err);
    res.status(500).send("ERROR : " + err?.message);
  }
});

//login user api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // check if email id is predent or not
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("invalid credentials!");
    }

    //check for password
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      //create json web token (jwt)

      const token = await user.getJWT();
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successfull!");
});

module.exports = authRouter;
