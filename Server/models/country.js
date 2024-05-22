const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      maxLength: 50,
    },
    states: [
      {
        type: mongoose.Types.ObjectId,
        ref: "State",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Country", countrySchema);
