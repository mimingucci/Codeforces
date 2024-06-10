const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "In Queue",
    },
    time: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      required: true,
    },
    memory: {
      type: Number,
      default: 0,
    },
    stderr: {
      type: String,
      default: "",
    },
    stdin: {
      type: String,
      default: "",
    },
    stdout: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      required: true,
    },
    problem: {
      type: mongoose.Types.ObjectId,
      ref: "Problem",
    },
    token: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);
