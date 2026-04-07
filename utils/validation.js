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

const validateEditData = (req) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
  ];
  const isValidRequest = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key),
  );
  return isValidRequest;
};

const validateNewPassword = (password) => {
  if (!validator.isStrongPassword(password)) {
    return false;
  }
  return true;
};

module.exports = { validateSignUpData, validateEditData, validateNewPassword };
