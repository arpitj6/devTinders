const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const {
  normalizeEmail,
  validateEditData,
  validateNewPassword,
  validateProfileEditValues,
} = require("../utils/validation");
const User = require("../model/user");

//get user profile by id (usig jwt)
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user.getPublicProfile());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// EDIT USER PROFILE
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      return res.status(400).json({ message: "invalid request fields" });
    }

    validateProfileEditValues(req.body);

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];

      if (typeof value === "string") {
        loggedInUser[key] = value.trim();
        return;
      }

      loggedInUser[key] = value;
    });

    await loggedInUser.save();
    res.status(200).json({
      message: "user edit successful!!",
      data: loggedInUser.getPublicProfile(),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//forgot password
profileRouter.post("/profile/password", async (req, res) => {
  try {
    const emailId = normalizeEmail(req.body.email || "");
    const oldPassword = req.body.oldPassword?.trim();
    const newPassword = req.body.newPassword?.trim();

    if (!emailId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "all fields are required" });
    }

    // check email
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "please enter correct old password!" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "new password must be different from old password",
      });
    }

    if (!validateNewPassword(newPassword)) {
      return res.status(400).json({ message: "please enter strong password" });
    }

    //if correct update the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({
      message: "password updated successfully!",
      data: user.getPublicProfile(),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = profileRouter;
