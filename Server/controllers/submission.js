const asyncHanlder = require("express-async-handler");
const { getByCode } = require("../repositories/language");
const User = require("../models/user");
const {
  save,
  getById,
  getByAuthor,
  update,
} = require("../repositories/submission");
const { MissingFieldsError } = require("../errors/input");
const { default: mongoose } = require("mongoose");
const { userExists } = require("../services/user");
const { UserNotFoundError } = require("../errors/user");
const { problemExists } = require("../services/problem");
const Submission = require("../models/submission");
const createSubmission = asyncHanlder(async (req, res) => {
  if (
    !req.user._id ||
    !req.body.language ||
    !req.body.code ||
    !req.body.problem ||
    !req.body.token
  )
    throw new MissingFieldsError("Please login to submit your solution");
  const valid = await problemExists(mongoose.Types.ObjectId(req.body.problem));
  if (!valid) throw new Error("Cannot find that problem");
  const rs = await save({
    author: req.user._id,
    language: req.body.language,
    code: req.body.code,
    problem: req.body.problem,
    token: req.body.token,
  });
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Submission failed",
  });
});

const getSubmissionById = asyncHanlder(async (req, res) => {
  const id = req.query.id;
  if (!id) throw new MissingFieldsError("Id Submission required");
  const rs = await getById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get submission",
  });
});

const getSubmissionByAuthor = asyncHanlder(async (req, res) => {
  const { author } = req.params;
  const valid = await userExists({ id: mongoose.Types.ObjectId(author) });
  if (!valid) throw new UserNotFoundError(`Cannot find user with id ${author}`);
  const rs = await getByAuthor(mongoose.Types.ObjectId(author));
  return res.json({
    status: "success",
    data: rs,
  });
});

const updateSubmission = asyncHanlder(async (req, res) => {
  if (!req.body.status || !req.body.time || !req.body.memory || !req.body.token)
    throw new MissingFieldsError("Missing Fields");
  let data = {
    status: req.body.status,
    time: req.body.time,
    memory: req.body.memory,
  };
  if (req.body.stderr) {
    data.stderr = req.body.stderr;
  }
  if (req.body.stdin) {
    data.stdin = req.body.stdin;
  }
  if (req.body.stdout) {
    data.stdout = req.body.stdout;
  }
  const rs = await update(req.body.token, data);
  return res.json({
    status: rs ? "success" : "error",
    data: rs ? rs : "Cannot update submisson",
  });
});

const pagingSubmissionByAuthor = asyncHanlder(async (req, res) => {
  if (!req.query.author) throw new MissingFieldsError("Required author id");
  const user = await User.findOne({ username: req.query.author });
  if (!user || user.username !== req.query.author) {
    throw new UserNotFoundError("Cannot find user");
  }
  req.query.author = user._id.toString();
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
  let queryCommand = Submission.find(query)
    .sort("-createdAt")
    .populate({ path: "author", model: "User", select: "username" })
    .populate({ path: "problem", model: "Problem", select: "title" });
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
    const cnt = await Submission.find({}).countDocuments();
    return res.status(200).json({
      success: results ? "success" : "failure",
      numberOfPage: Math.ceil(cnt / 100),
      data: results ? results : "Cannot get submissions",
    });
  });
});

module.exports = {
  createSubmission,
  getSubmissionById,
  getSubmissionByAuthor,
  updateSubmission,
  pagingSubmissionByAuthor,
};
