const Country = require("../models/country");
const asyncHandler = require("express-async-handler");
const {
  save,
  addState,
  deleteState,
  alreadyExists,
  getById,
  getByName,
} = require("../repositories/country");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const createCountry = asyncHandler(async (req, res, next) => {
  try {
    const state = await save(req.body);
    return res.status(200).json({
      status: state ? "success" : "failure",
      data: state,
    });
  } catch (error) {
    next(error);
  }
});

const addStateToCountry = asyncHandler(async (req, res) => {
  const { country, state } = req.body;
  if (!country || !state) throw new Error("Missing country or state id");
  const isFound = await alreadyExists(
    mongoose.Types.ObjectId(country),
    mongoose.Types.ObjectId(state)
  );
  if (isFound) {
    return res.status(200).json({
      status: "success",
      data: "State is already added to the country",
    });
  }
  const rs = await addState(
    mongoose.Types.ObjectId(country),
    mongoose.Types.ObjectId(state)
  );
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const deleteStateToCountry = asyncHandler(async (req, res) => {
  const { country, state } = req.body;
  if (!country || !state) throw new Error("Missing country or state id");
  const isFound = await alreadyExists(
    mongoose.Types.ObjectId(country),
    mongoose.Types.ObjectId(state)
  );
  if (!isFound) {
    return res.status(200).json({
      status: "success",
      data: "State is not already added to the country",
    });
  }
  const rs = await deleteState(
    mongoose.Types.ObjectId(country),
    mongoose.Types.ObjectId(state)
  );
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const getCountryByName = asyncHandler(async (req, res) => {
  const name = req.query.name;
  if (!name) throw new Error("Missing country name");
  const rs = await getByName(name);
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

module.exports = {
  createCountry,
  addStateToCountry,
  deleteStateToCountry,
  getCountryByName,
};
