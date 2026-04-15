const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

const { validateEditData } = require("../utils/validation");
const { validateNewPassword } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../model/user");

//get user profile by id (usig jwt)
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// EDIT USER PROFILE
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      res.status(400).send("invalid request fields");
      return;
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res
      .status(200)
      .json({ message: "user edit successful!!", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.post("/profile/password", async (req, res) => {
  try {
    // check email
    const user = await User.findOne({ emailId: req.body.email });
    if (!user) {
      res.status(404).json({ message: "user not found!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      res.status(400).json({ message: "please enter correct old password!" });
      return;
    }
    if (!validateNewPassword(req.body.newPassword)) {
      res.status(400).json({ message: "please enter strong password" });
      return;
    }
    //if correct update the new password
    user["password"] = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    res
      .status(200)
      .json({ message: "password updated successfully!", data: user });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;
