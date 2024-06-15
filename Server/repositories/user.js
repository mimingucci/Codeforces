const country = require("../models/country");
const User = require("../models/user");

const save = async (user) => {
  let u = convertToModel(user);
  return await u
    .save()
    .then((savedUser) => savedUser)
    .catch((err) => err);
};

const getAll = async () => {
  const users = await User.find({ enabled: true }).select(
    "-password -refreshToken"
  );
  return users;
};

const getAllByAdmin = async () => {
  const users = await User.find({}).select("-password -refreshToken");
  return users;
};

const getById = async (_id) => {
  return await User.findOne({ _id, enabled: true })
    .select("-password -refreshToken")
    .populate({ path: "chats", model: "Chat" });
};

const getByIdAllFields = async (_id) => {
  return await User.findOne({ _id, enabled: true });
};

const getByUsername = async (username) => {
  return await User.findOne({ username, enabled: true }).select(
    "-password -refreshToken"
  );
};

const getByEmail = async (email) => {
  return await User.findOne({ email, enabled: true }).select(
    "-password -refreshToken"
  );
};

const addToChat = async ({ id, chat }) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { $push: { chats: chat } },
    { new: true }
  );
};

const deleteFromChat = async ({ id, chat }) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { $pull: { chats: chat } },
    { new: true }
  );
};

const getAllChat = async (id) => {
  return await User.findOne({ _id: id }).populate({
    path: "chats",
    model: "Chat",
  });
};

const update = async (id, user) => {
  const data = await User.findOne({ _id: id });
  for (let [key, value] of Object.entries(user)) {
    data[key] = value;
  }
  const rs = await data.save();
  return rs;
};

const updatePassword = async (id, password) => {
  return await User.findOneAndUpdate(
    { _id: id, enabled: true },
    { password },
    { new: true }
  ).select("-password -refreshToken");
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

const getByState = async (state) => {
  const rs = await User.find({ state, enabled: true });
  return rs;
};

const getByCountry = async (country) => {
  const rs = await User.find({ country, enabled: true });
  return rs;
};

const setCountry = async (id, country) => {
  const rs = await User.findByIdAndUpdate(id, { country }, { new: true });
  return rs;
};

const setState = async (id, state) => {
  const rs = await User.findByIdAndUpdate(id, { state }, { new: true });
  return rs;
};

const unsetCountry = async (id) => {
  const rs = await User.findByIdAndUpdate(
    id,
    { $unset: { country: "" } },
    { new: true }
  );
  return rs ? true : false;
};

const unsetState = async (id) => {
  const rs = await User.findByIdAndUpdate(
    id,
    { $unset: { state: "" } },
    { new: true }
  );
  return rs ? true : false;
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
  getByState,
  getByCountry,
  setCountry,
  setState,
  unsetState,
  unsetCountry,
  getByIdAllFields,
  updatePassword,
  getAllByAdmin,
  addToChat,
  deleteFromChat,
  getAllChat,
};
