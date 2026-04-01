const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender data is incorrect");
        }
      },
      required:true
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
