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
} = require("../repositories/problem");
const tc = require("../repositories/testcase");
const { MissingFieldsError } = require("../errors/input");
const { default: mongoose } = require("mongoose");
const { userExists } = require("../services/user");
const { UserNotFoundError } = require("../errors/user");
const { problemExists } = require("../services/problem");

const createProblem = asyncHandler(async (req, res) => {
  if (
    !req.body.title ||
    !req.body.statement ||
    !req.body.author ||
    !req.body.timelimit ||
    !req.body.memorylimit
  )
    throw new MissingFieldsError("Missing Fields");
  const valid = await userExists(mongoose.Types.ObjectId(req.body.author));
  if (!valid)
    throw new UserNotFoundError(`Cannot find user with id ${req.body.author}`);
  const problem = await save(req.body);
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

module.exports = {
  createProblem,
  getProblemById,
  getAllProblems,
  createTestCase,
};
