const { default: mongoose } = require("mongoose");
const Chat = require("../models/chat");

const save = async (users) => {
  let chat = new Chat();
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

const addUserToChat = async (id, user) => {
  const rs = await Chat.findByIdAndUpdate(
    id,
    { $push: { members: user } },
    { new: true }
  );
  return rs;
};

const deleteUserFromChat = async (id, user) => {
  const rs = await Chat.findByIdAndUpdate(
    id,
    { $pull: { members: user } },
    { new: true }
  );
  return rs;
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
};
