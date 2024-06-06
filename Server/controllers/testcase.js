const { default: mongoose } = require("mongoose");
const { MissingFieldsError } = require("../errors/input");
const {
  save,
  update,
  getById,
  deleteById,
} = require("../repositories/testcase");
const asyncHandler = require("express-async-handler");

const getTestCaseById = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) throw new MissingFieldsError("Missing test case id field");
  const rs = await getById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const updateTestCaseById = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id || !req.body.input || !req.body.output)
    throw new MissingFieldsError("Missing test case id field");
  const rs = await update(mongoose.Types.ObjectId(id), {
    input: req.body.input,
    output: req.body.output,
  });
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});
module.exports = {
  getTestCaseById,
  updateTestCaseById,
};
