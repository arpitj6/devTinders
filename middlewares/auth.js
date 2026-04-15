const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req?.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // attach the user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = { userAuth };
