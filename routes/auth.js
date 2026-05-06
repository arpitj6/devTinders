const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const User = require("../model/user");
const { normalizeEmail, validateSignUpData } = require("../utils/validation");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

//create user
authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data before saving into db
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      photoUrl,
      about,
      age,
    } = req.body;
    const normalizedEmail = normalizeEmail(emailId);

    const existingUser = await User.findOne({ emailId: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailId: normalizedEmail,
      gender,
      age,
      about: about?.trim() || undefined,
      photoUrl: photoUrl?.trim() || undefined,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, cookieOptions);
    res.status(201).json({
      message: "user created successfully",
      data: savedUser.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: err?.message || "unable to signup" });
  }
});

//login user api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const normalizedEmail = normalizeEmail(emailId);

    // check if email id is predent or not
    const user = await User.findOne({ emailId: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //check for password
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      //create json web token (jwt)
      const token = await user.getJWT();
      res.cookie("token", token, cookieOptions);
      res.json(user.getPublicProfile());
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).json({ message: err?.message || "unable to login" });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    ...cookieOptions,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "user logged out successfully" });
});

module.exports = authRouter;
