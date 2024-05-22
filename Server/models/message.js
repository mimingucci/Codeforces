const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    from: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    emoji: {
      type: String,
      default: "nothing",
      enum: [
        "nothing",
        "happy",
        "angry",
        "sad",
        "hate",
        "funny",
        "lovely",
        "like",
        "dislike",
        "crying",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
