const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

const { validateEditData } = require("../utils/validation");
const { validateNewPassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

//get user profile by id (usig jwt)
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("invalid request fields");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({ message: "user edit successful!!", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    //match password from db
    const loggedInUser = req.user;
    const isPasswordValid = await bcrypt.compare(
      req.body.oldPassword,
      loggedInUser.password,
    );
    if (!isPasswordValid) {
      throw new Error("please enter correct old password!");
    }
    if (!validateNewPassword(req.body.newPassword)) {
      throw new Error("please enter strong password");
    }
    //if correct update the new password

    loggedInUser["password"] = await bcrypt.hash(req.body.newPassword, 10);
    await loggedInUser.save();
    res.json({ message: "password updated successfully!", data: loggedInUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
module.exports = profileRouter;
