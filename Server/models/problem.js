const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    statement: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
      },
    ],
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
    image: {
      type: String,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    solution: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
    timelimit: {
      type: Number,
      required: true,
    },
    memorylimit: {
      type: Number,
      required: true,
    },
    testcases: [{ type: mongoose.Types.ObjectId, ref: "TestCase" }],
    rating: {
      type: Number,
      min: 500,
      max: 3500,
    },
    submissions: [{ type: mongoose.Types.ObjectId, ref: "Submission" }],
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);
