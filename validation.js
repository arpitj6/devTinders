const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("first name and last name is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("please enter a valid email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password");
  }
};

module.exports = { validateSignUpData };
