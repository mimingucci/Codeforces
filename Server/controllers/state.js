const State = require("../models/state");
const asyncHandler = require("express-async-handler");
const { save, deleteById, getById } = require("../repositories/state");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const createState = asyncHandler(async (req, res, next) => {
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

const getStateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return new Error("Missing state id");
  const state = await getById(mongoose.Types.ObjectId(id));
  return res.status(200).json({
    status: state ? "success" : "failure",
    data: state,
  });
});

const deleteStateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return new Error("Missing state id");
  const state = await deleteById(mongoose.Types.ObjectId(id));
  return res.status(200).json({
    status: state ? "success" : "failure",
  });
});

module.exports = {
  createState,
  getStateById,
  deleteStateById,
};
