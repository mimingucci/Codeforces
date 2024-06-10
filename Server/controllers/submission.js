const asyncHanlder = require("express-async-handler");
const { getByCode } = require("../repositories/language");
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

module.exports = {
  createSubmission,
  getSubmissionById,
  getSubmissionByAuthor,
  updateSubmission,
};
