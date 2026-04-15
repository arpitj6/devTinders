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
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
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
        if (value?.startsWith("$2")) {
          return;
        }

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
      maxLength: 400,
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80",
      validate(value) {
        if (value && !validators.isURL(value)) {
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

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model("User", userSchema);
