import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      required: false,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next()

  this.password = bcrypt.hash(this.password, 10)
  next()

})

userSchema.method.isPasswordCorrect = async function (password) {

  await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function () {

  jwt.sign({
      _id: this._id,
      email: this.email,
      username:this.username,
      fullname:this.fullname,
  },
  process.env.ACCESS_TOKEN_SECRET,

   {
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY

   }
)
  
  

}

userSchema.method.generateRefreshToken = function () {

  jwt.sign({
      _id: this._id,

  },
  process.env.REFRESH_TOKEN_SECRET,

   {
       expiresIn:process.env.REFRESH_TOKEN_EXPIRY

   }
)
  
  

}

userSchema.method.generateRefreshToken = function () { }


export const User = mongoose.model("User", userSchema)


