const asyncHandler = require("express-async-handler");

const {
  save,
  getAll,
  deleteByName,
  deleteById,
  getByName,
  getById,
  updateById,
} = require("../repositories/tag");
const { MissingFieldsError } = require("../errors/input");
const { default: mongoose } = require("mongoose");

const createTag = asyncHandler(async (req, res) => {
  const name = req.body.name;
  if (!name) throw new MissingFieldsError("Missing name field");
  const rs = await save(name);
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot create new tag",
  });
});

const getTagByName = asyncHandler(async (req, res) => {
  const name = req.query.name;
  if (!name) throw new MissingFieldsError("Missing name field");
  const rs = await getByName(name);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get tag by name",
  });
});

const getTagById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("Missing id field");
  const rs = await getById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get tag by id",
  });
});

const updateTagById = asyncHandler(async (req, res) => {
  const tag = req.body.tag;
  const name = req.body.name;
  if (!tag || !name) throw new MissingFieldsError("Missing inputs");
  const rs = await updateById(mongoose.Types.ObjectId(tag), name);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot update tag",
  });
});

const deleteTagById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("Missing id field");
  const rs = await deleteById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
  });
});

module.exports = {
  createTag,
  getTagById,
  getTagByName,
  updateTagById,
  deleteTagById,
};
