const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
