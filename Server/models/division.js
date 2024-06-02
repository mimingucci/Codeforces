const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    rated: {
      type: Boolean,
      default: false,
    },
    range: {
      type: Number,
      default: 1000000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Division", divisionSchema);
