const Country = require("../models/country");

const save = async (data) => {
  const country = new Country({ name: data.name });
  const rs = await country.save((err, result) => {
    if (err) throw err;
    return result;
  });
  return rs;
};

const addState = async (countryid, stateid) => {
  const rs = await Country.findByIdAndUpdate(countryid, {
    states: { $push: stateid },
  });
  return rs;
};

const deleteState = async (countryid, stateid) => {
  const rs = await Country.findByIdAndUpdate(countryid, {
    states: { $pull: stateid },
  });
  return rs;
};

const alreadyExists = async (countryid, stateid) => {
  const rs = await Country.find({ _id: countryid, states: { $in: [stateid] } });
  return rs ? true : false;
};

const getById = async (id) => {
  const rs = await Country.findById(id);
  return rs;
};

const getByName = async (name) => {
  const rs = await Country.find({ name });
  return rs;
};

module.exports = {
  save,
  addState,
  deleteState,
  alreadyExists,
  getById,
  getByName,
};
