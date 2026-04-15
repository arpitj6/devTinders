const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../model/connectionRequest.js");
const User = require("../model/user.js");
const SEND_ALLOWED_STATUS = ["interested", "ignored"];
const REVIEW_ALLOWED_STATUS = ["accepted", "rejected"];

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;
      // validation 1
      if (!SEND_ALLOWED_STATUS.includes(status)) {
        res.status(404).json({ message: "invalid status - " + status });
        return;
      }

      //   validation2
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("user not found");
      }

      //   validation 3 (if request is already sent or other person already sent the request)
      const existingConnectionRequest = await ConnectionRequest.exists({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      // in above query we can use findOne also but it is a heavy query as compared to exists
      if (existingConnectionRequest) {
        return res.status(400).send("connection request already exisit");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //   validation1
      if (!REVIEW_ALLOWED_STATUS.includes(status)) {
        return res.status(404).json({ message: "invalid request - " + status });
      }

      //   validation 2
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: " connection request " + status });
    } catch (err) {
      res.status(400).json({ message: "ERROR : " + err.message });
    }
  },
);

module.exports = requestRouter;
