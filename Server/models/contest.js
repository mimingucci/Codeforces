const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    writers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    testers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    division: {
      type: mongoose.Types.ObjectId,
      ref: "Division",
    },
    problems: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Problem",
      },
    ],
    starttime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    registers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    announcements: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      default: "Upcoming",
      enum: ["Upcoming", "Running", "Completed"],
    },
    standings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contest", contestSchema);
