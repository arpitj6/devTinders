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

const normalizeEmail = (email = "") => validator.normalizeEmail(email.trim());

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, gender, photoUrl, about } =
    req?.body;

  if (!firstName?.trim() || !lastName?.trim()) {
    throw new Error("first name and last name is required");
  }

  if (!emailId?.trim() || !validator.isEmail(emailId.trim())) {
    throw new Error("please enter a valid email id");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password");
  }

  if (!gender || !["male", "female", "others"].includes(gender)) {
    throw new Error("please enter a valid gender");
  }

  if (photoUrl?.trim() && !validator.isURL(photoUrl.trim())) {
    throw new Error("please enter a valid photo url");
  }

  if (about?.trim() && !validator.isLength(about.trim(), { max: 300 })) {
    throw new Error("about section must be within 300 characters");
  }
};

const validateEditData = (req) => {
  if (!req?.body || Object.keys(req.body).length === 0) {
    return false;
  }

  const isValidRequest = Object.keys(req?.body).every((key) =>
    ALLOWED_FIELDS.includes(key),
  );
  return isValidRequest;
};

const validateProfileEditValues = (data) => {
  const { firstName, lastName, age, gender, about, photoUrl } = data;

  if (firstName !== undefined && !firstName?.trim()) {
    throw new Error("first name is required");
  }

  if (lastName !== undefined && !lastName?.trim()) {
    throw new Error("last name is required");
  }

  if (age !== undefined) {
    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 100) {
      throw new Error("please enter a valid age between 18 and 100");
    }
  }

  if (gender !== undefined && !["male", "female", "others"].includes(gender)) {
    throw new Error("please enter a valid gender");
  }

  if (about !== undefined && !validator.isLength(String(about).trim(), { max: 300 })) {
    throw new Error("about section must be within 300 characters");
  }

  if (photoUrl !== undefined && photoUrl?.trim() && !validator.isURL(photoUrl.trim())) {
    throw new Error("please enter a valid photo url");
  }
};

const validateNewPassword = (password) => {
  return validator.isStrongPassword(password);
};

module.exports = {
  normalizeEmail,
  validateSignUpData,
  validateEditData,
  validateProfileEditValues,
  validateNewPassword,
};
