const { default: mongoose } = require("mongoose");
const Chat = require("../models/chat");

const save = async ({ users, name }) => {
  let chat = new Chat();
  chat.name = name;
  users.forEach((element) => {
    chat.members.push(mongoose.Types.ObjectId(element));
  });
  const rs = await chat.save();
  return rs;
};

const getById = async (_id) => {
  const rs = await Chat.findOne({ _id });
  return rs;
};

const addUserToChat = async ({ chat, user }) => {
  const rs = await Chat.findByIdAndUpdate(
    chat,
    { $push: { members: user } },
    { new: true }
  );
  return rs;
};

const deleteUserFromChat = async ({ chat, user }) => {
  const rs = await Chat.findByIdAndUpdate(
    chat,
    { $pull: { members: user } },
    { new: true }
  );
  return rs;
};

const getAllUsers = async (id) => {
  const rs = await Chat.findOne({ _id: id }).populate({
    path: "members",
    model: "Users",
    select: "username",
  });
};

const deleteById = async (id) => {
  const rs = await Chat.findByIdAndDelete(id);
  return rs ? true : false;
};

module.exports = {
  save,
  getById,
  deleteUserFromChat,
  addUserToChat,
  deleteById,
  getAllUsers,
};
