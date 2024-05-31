const mongoose = require("mongoose");

const emojiSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    default: "like",
    enum: [
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
});

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
      required: [true, "Please provide chat room id"],
    },
    seen: {
      type: Boolean,
      default: false,
    },
    emoji: [emojiSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
