import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

let userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is a required field"],
      minLength: [4, "username must be above 4 characters"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is a required field"]
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      minLength: [6, "Min character length is 6"],
      required: [true, "password is a required field"],
    },
    confirmPassword: {
      type: String,
      select: false,
      minLength: [6, "Min character length is 6"],
      required: [true, "Confirm password is a required field"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password and Confirm Password do not match",
      },
    },
    displayPicture: {
      type: String,
      default: "https://res.cloudinary.com/dqj0v4x5g/image/upload/v1698231232/defaultProfilePic.png",
    },
  },
  {
    timestamps: true,
  }
);

//pre middleware
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10)
  this.confirmPassword = undefined
  next()
})

userSchema.methods.comparePassword = async function (pwd, pwdDB) {
  return await bcrypt.compare(pwd, pwdDB)
}

let User = model("User", userSchema);

export default User;