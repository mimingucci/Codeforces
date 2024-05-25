const State = require("../models/state");

const save = async (data) => {
  const state = new State({ name: data.name });
  const rs = await state.save((err, result) => {
    if (err) throw err;
    return result;
  });
  return rs;
};

const deleteById = async (id) => {
  const rs = await State.findByIdAndDelete(id);
  return rs ? true : false;
};

const getById = async (id) => {
  return await State.findById(id);
};

module.exports = {
  save,
  deleteById,
  getById,
};
