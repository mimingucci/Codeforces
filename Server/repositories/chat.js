const { default: mongoose } = require("mongoose");
const Chat = require("../models/chat");
const { addToChat, deleteFromChat } = require("./user");
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
  ).populate({ path: "members", model: "User", select: "username" });
  return rs;
};

const deleteUserFromChat = async ({ chat, user }) => {
  const rs = await Chat.findByIdAndUpdate(
    chat,
    { $pull: { members: user } },
    { new: true }
  ).populate({ path: "members", model: "User", select: "username" });
  return rs;
};

const getAllUsers = async (id) => {
  const rs = await Chat.findOne({ _id: id }).populate({
    path: "members",
    model: "User",
    select: "username",
  });
  return rs.members;
};

const deleteById = async (id) => {
  const rs = await Chat.findByIdAndDelete(id);
  return rs ? true : false;
};

const individualChat = async ({ id1, id2, name1, name2 }) => {
  let rs = await Chat.findOne({
    members: { $all: [id1, id2], $size: 2 },
  });
  if (!rs) {
    let chat = new Chat();
    chat.name = `${name1}-${name2}`;
    chat.members.push(id1, id2);
    rs = await chat.save();
    await addToChat({ id: id1, chat: rs?._id });
    await addToChat({ id: id2, chat: rs?._id });
  }
  return rs;
};

module.exports = {
  save,
  getById,
  deleteUserFromChat,
  addUserToChat,
  deleteById,
  getAllUsers,
  individualChat,
};
