const mongoose = require("mongoose");
const validators = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validators.isEmail(value)) {
          throw new Error("email is invalid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validators.isStrongPassword(value)) {
          throw new Error("please enter strong password : " + value);
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender data is incorrect");
        }
      },
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    about: {
      type: String,
      default: "this is the default about content",
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80",
      validate(value) {
        if (!validators.isURL(value)) {
          throw new Error("please ented valid url- " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isPasswordValid;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "devTinder@999", {
    expiresIn: "7d",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
