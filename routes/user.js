const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");

const USER_SAFE_DATA = "firstName lastName age gender photoUrl";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "data fetched successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        // if i have send the request then show the other person's data else show mine data
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ message: "data fetched successfully!", data });
  } catch (err) {
    res.status(400).json({ message: "ERROR : " + err.message });
  }
});

module.exports = userRouter;
