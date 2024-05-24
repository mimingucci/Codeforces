const User = require("../models/user");

const save = async (user) => {
  let u = convertToModel(user);
  return await u
    .save()
    .then((savedUser) => savedUser)
    .catch((err) => err);
};

const getAll = async () => {
  const users = await User.find({}).select("-password -refreshToken -role");
  return users;
};

const getById = async (_id) => {
  return await User.find({ _id }).select("-password -refreshToken -role");
};

const getByUsername = async (username) => {
  return await User.find({ username }).select("-password -refreshToken -role");
};

const getByEmail = async (email) => {
  return await User.find({ email }).select("-password -refreshToken -role");
};

const update = async (id, user) => {
  return await User.findByIdAndUpdate(id, user, { new: true }).select(
    "-password -refreshToken -role"
  );
};

const deleteById = async (_id) => {
  const res = await User.findByIdAndDelete(_id);
  return res ? true : false;
};

const deleteByEmail = async (email) => {
  const res = await User.findOneAndDelete({ email: email });
  return res ? true : false;
};

const convertToModel = (data) => {
  let u = new User();
  for (let [key, val] of Object.entries(data)) {
    u.set(key, val);
  }
  return u;
};

module.exports = {
  save,
  getById,
  getByUsername,
  getAll,
  getByEmail,
  update,
  deleteById,
  deleteByEmail,
};
