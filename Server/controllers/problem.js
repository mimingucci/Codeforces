const asyncHandler = require("express-async-handler");
const {
  save,
  getById,
  getByAuthor,
  getByTag,
  like,
  dislike,
  deleteLike,
  deleteDislike,
  addTestCase,
  deleteTestCase,
  deleteById,
  update,
  getAll,
  getTestCases,
} = require("../repositories/problem");
const tc = require("../repositories/testcase");
const { MissingFieldsError } = require("../errors/input");
const { default: mongoose } = require("mongoose");
const { userExists } = require("../services/user");
const { UserNotFoundError } = require("../errors/user");
const { problemExists } = require("../services/problem");
const Problem = require("../models/problem");

const createProblem = asyncHandler(async (req, res) => {
  if (
    !req.body.title ||
    !req.body.statement ||
    !req.user._id ||
    !req.body.timelimit ||
    !req.body.memorylimit
  )
    throw new MissingFieldsError("Missing Fields");
  const problem = await save({
    author: req.user._id,
    title: req.body.title,
    statement: req.body.statement,
    timelimit: req.body.timelimit,
    memorylimit: req.body.memorylimit,
  });
  return res.json({
    status: problem ? "success" : "failure",
    data: problem ? problem : "Cannot create new problem",
  });
});

const getProblemById = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) throw new MissingFieldsError("Missing id field");
  const rs = await getById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot find problem",
  });
});

const getAllProblems = asyncHandler(async (req, res) => {
  const rs = await getAll();
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const fetchProblem = asyncHandler(async (req, res) => {
  let queryObj = { ...req.query };
  let excludedFields = ["page", "sort", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  let query = JSON.parse(queryString);
  // Filtering
  if (queryObj?.title) query.title = { $regex: queryObj.title, $options: "i" };
  let queryCommand = Problem.find(query);
  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  // fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  // paging
  const page = +req.query.page || 1;
  const limit = 100;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  //execute query command
  queryCommand.exec(async (err, results) => {
    if (err) throw new Error(err.message);
    const cnt = await Problem.find({}).countDocuments();
    return res.status(200).json({
      success: results ? "success" : "failure",
      numberOfPage: Math.ceil(cnt / 5),
      data: results ? results : "Cannot get products",
    });
  });
});

const getAllTestCases = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) throw new MissingFieldsError("Missing id field");
  const rs = await getTestCases(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const createTestCase = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id || !req.body.input || !req.body.output)
    throw new MissingFieldsError("Missing fields");
  let valid = true;
  valid = await problemExists(mongoose.Types.ObjectId(id));
  if (!valid) throw new Error(`Cannot find problem with id ${id}`);
  const testcase = await tc.save(req.body);
  const rs = await addTestCase(mongoose.Types.ObjectId(id), testcase._id);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const updateProblemById = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) throw new MissingFieldsError("Missing fields");
  let valid = true;
  valid = await problemExists(mongoose.Types.ObjectId(id));
  if (!valid) throw new Error(`Cannot find problem with id ${id}`);
  let data = {};
  if (req.body.statement) data.statement = req.body.statement;
  if (req.body.title) data.title = req.body.title;
  if (req.body.timelimit) data.timelimit = req.body.timelimit;
  if (req.body.memorylimit) data.memorylimit = req.body.memorylimit;
  const rs = await update(mongoose.Types.ObjectId(id), data);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

module.exports = {
  createProblem,
  getProblemById,
  getAllProblems,
  createTestCase,
  getAllTestCases,
  updateProblemById,
  fetchProblem,
};
