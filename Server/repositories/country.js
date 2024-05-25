const Country = require("../models/country");

const save = async (data) => {
  const country = new Country({ name: data.name });
  const rs = await country.save();
  return rs;
};

const addState = async (countryid, stateid) => {
  const rs = await Country.findByIdAndUpdate(
    countryid,
    {
      $push: { states: stateid },
    },
    { new: true }
  );
  return rs;
};

const deleteState = async (countryid, stateid) => {
  const rs = await Country.findByIdAndUpdate(
    countryid,
    {
      $pull: { states: stateid },
    },
    { new: true }
  );
  return rs;
};

const alreadyExists = async (countryid, stateid) => {
  const rs = await Country.find({ _id: countryid, states: { $in: [stateid] } });
  return rs.length ? true : false;
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
