const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
    language: {
      type: mongoose.Types.ObjectId,
      ref: "Language",
    },
    problem: {
      type: mongoose.Types.ObjectId,
      ref: "Problem",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);
