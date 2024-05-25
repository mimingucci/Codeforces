const Tag = require("../models/tag");

const save = async (data) => {
  let tag = new Tag();
  tag.name = data.name;
  const rs = await tag.save().then((t) => t);
  return rs;
};

const getAll = async () => {
  return await Tag.find();
};

const getByName = async (name) => {
  return await Tag.findOne({ name });
};

const deleteTag = async (name) => {
  const rs = await Tag.findOneAndDelete({ name });
  return rs ? true : false;
};

module.exports = {
  save,
  getAll,
  deleteTag,
  getByName,
};
