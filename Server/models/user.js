const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: String,
    lastname: String,
    description: String,
    role: {
      type: String,
      default: "user",
    },
    rating: {
      type: Number,
      default: 0,
    },
    contribution: {
      type: Number,
      default: 0,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    authenticationType: {
      type: String,
      default: "DATABASE",
      enum: ["DATABASE", "GOOGLE", "FACEBOOK"],
    },
    state: {
      type: mongoose.Types.ObjectId,
      ref: "State",
    },
    country: {
      type: mongoose.Types.ObjectId,
      ref: "Country",
    },
    chats: {
      type: [mongoose.Types.ObjectId],
      ref: "Chat",
      default: [],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dtov6mocw/image/upload/v1717788682/Codeforces/o5kutr4fekswjrvg7i1r.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: "text" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
  generateAccessToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
  },
  generateRefreshToken: function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
  },
};

module.exports = mongoose.model("User", userSchema);
