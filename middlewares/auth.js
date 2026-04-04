const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("invalid token..!");
    }
    const decodedMessage = await jwt.verify(token, "devTinder@999");

    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    // attach the user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
