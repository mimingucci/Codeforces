const {
  save,
  getById,
  deleteUserFromChat,
  addUserToChat,
  deleteById,
} = require("../repositories/chat");
const asyncHandler = require("express-async-handler");
const { MissingFieldsError } = require("../errors/input");
const { UserNotFoundError } = require("../errors/user");
const { userExists } = require("../services/user");
const { default: mongoose } = require("mongoose");
const { chatExists } = require("../services/chat");
const User = require("../models/user");
const Chat = require("../models/chat");

const createChat = asyncHandler(async (req, res) => {
  if (!req.body.users || req.body.users.length == 0)
    throw new MissingFieldsError("Push user in chat room");
  let valid = true;
  req.body.users.forEach(async (user) => {
    valid = await userExists(mongoose.Types.ObjectId(user));
    if (!valid) throw new Error(`Cannot find user with id ${user}`);
  });
  const rs = await save(req.body.users);
  req.body.users.forEach(async (user) => {
    let u = await User.findById(mongoose.Types.ObjectId(user));
    u.chats.push(rs._id);
    await u.save();
  });
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot create new chat room",
  });
});

const deleteChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("Missing id chat room field");
  let e = await chatExists(mongoose.Types.ObjectId(id));
  if (!e)
    return res.status(200).json({
      status: "success",
    });
  const rs = await deleteById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
  });
});

const getChatsForUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("chats");

    return res.status(200).json({
      status: "success",
      data: user.chats,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      data: error.message,
    });
  }
});

const getMessagesForSpecificChat = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(mongoose.Types.ObjectId(id)).select(
      "members"
    );
    const lastMessage = await Message.findOne({
      chatId: id,
    });
    return res.status(200).json({
      status: "success",
      data: {
        chat,
        lastMessage,
      },
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      status: "failure",
      data: error.message,
    });
  }
});

module.exports = {
  createChat,
  deleteChat,
  getChatsForUser,
  getMessagesForSpecificChat,
};
