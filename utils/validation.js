const validator = require("validator");
const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "skills",
  "about",
  "photoUrl",
];
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req?.body;
  if (!firstName?.trim() || !lastName?.trim()) {
    throw new Error("first name and last name is required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("please enter a valid email id");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password");
  }
};

const validateEditData = (req) => {
  const isValidRequest = Object.keys(req?.body).every((key) =>
    ALLOWED_FIELDS.includes(key),
  );
  return isValidRequest;
};

const validateNewPassword = (password) => {
  return validator.isStrongPassword(password);
};

module.exports = { validateSignUpData, validateEditData, validateNewPassword };
