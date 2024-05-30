const Tag = require("../models/tag");

const save = async (name) => {
  let tag = new Tag();
  tag.name = name;
  const rs = await tag.save();
  return rs;
};

const getAll = async () => {
  return await Tag.find();
};

const getByName = async (name) => {
  return await Tag.findOne({ name });
};

const deleteByName = async (name) => {
  const rs = await Tag.findOneAndDelete({ name });
  return rs ? true : false;
};

const deleteById = async (id) => {
  const rs = await Tag.findByIdAndDelete(id);
  return rs ? true : false;
};

const getById = async (id) => {
  const rs = await Tag.findOne({ _id: id });
  return rs;
};

const updateById = async (id, name) => {
  const rs = await Tag.findByIdAndUpdate(id, { name }, { new: true });
  return rs;
};

module.exports = {
  save,
  getAll,
  deleteByName,
  deleteById,
  getByName,
  getById,
  updateById,
};
