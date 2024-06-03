const TestCase = require("../models/testcase");

const save = async (data) => {
  const tc = new TestCase({ input: data.input, output: data.output });
  return await tc.save();
};

const update = async (id, data) => {
  const rs = await TestCase.findByIdAndUpdate(id, data);
  return rs;
};

const getById = async (id) => {
  const rs = await TestCase.findById(id);
  return rs;
};

const deleteById = async (id) => {
  const rs = await TestCase.findByIdAndDelete(id);
  return rs ? true : false;
};

module.exports = {
  save,
  update,
  getById,
  deleteById,
};
