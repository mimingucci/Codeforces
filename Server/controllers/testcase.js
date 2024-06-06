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

module.exports = {
  getTestCaseById,
};
