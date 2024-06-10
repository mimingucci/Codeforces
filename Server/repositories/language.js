const Language = require("../models/language");

const save = async (data) => {
  const language = new Language({ code: data.code, name: data.name });
  const rs = await language.save();
  return rs;
};

const update = async (id, data) => {
  const rs = await Language.findByIdAndUpdate(id, data);
  return rs;
};

const getAll = async () => {
  const rs = await Language.find();
  return rs;
};

const getByCode = async (code) => {
  const rs = await Language.findOne({ code });
  return rs;
};

const getById = async (id) => {
  const rs = await Language.findById(id);
  return rs;
};

const deleteByCode = async (code) => {
  const rs = await Language.findOneAndDelete({ code });
  return rs ? true : false;
};

const deleteById = async (id) => {
  const rs = await Language.findByIdAndDelete(id);
  return rs ? true : false;
};

module.exports = {
  save,
  update,
  getByCode,
  getById,
  deleteByCode,
  deleteById,
  getAll,
};
