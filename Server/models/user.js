const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
    photo: String,
    description: String,
    role: {
      type: String,
      default: "user",
    },
    rating: {
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
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
};

module.exports = mongoose.model("User", userSchema);
