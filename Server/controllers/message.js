const asyncHandler = require("express-async-handler");
const {
  save,
  getById,
  getByAuthor,
  getByChatId,
  getByAuthorAndChatId,
  deleteById,
  update,
} = require("../repositories/message");
const { MissingFieldsError } = require("../errors/input");
const { userExists } = require("../services/user");
const { default: mongoose } = require("mongoose");
const Chat = require("../models/chat");
const { chatExists } = require("../services/chat");

const createMessage = asyncHandler(async (req, res) => {
  if (!req.body.content || !req.body.author || !req.body.chatId) {
    throw new MissingFieldsError("Missing inputs");
  }
  const [a, b] = await Promise.all([
    userExists(mongoose.Types.ObjectId(req.body.author)),
    chatExists(mongoose.Types.ObjectId(req.body.chatId)),
  ]);
  if (!a || !b) throw new Error("Invalid user id or chat id");
  const rs = await save(req.body);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

const getMessagesFromChat = asyncHandler(async (req, res) => {
  const chat = req.query.chatid;
  if (!chat) throw new MissingFieldsError("Missing chat id");
  let valid = await chatExists(mongoose.Types.ObjectId(chat));
  if (!valid) {
    throw new Error(`Cannot find chat room with id ${chat}`);
  }
  const rs = getByChatId(mongoose.Types.ObjectId(chat));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const getMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("Missing id field");
  const rs = await getById(mongoose.Types.ObjectId(id));
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get message by id",
  });
});

const getMessageByAuthor = asyncHandler(async (req, res) => {
  const author = req.query.from;
  if (!author) throw new MissingFieldsError("Missing id field");
  const rs = await getByAuthor(mongoose.Types.ObjectId(author));
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get message by author",
  });
});

const getMessageByAuthorAndChatId = asyncHandler(async (req, res) => {
  const chatId = req.query.chatId;
  const author = req.query.author;
  if (!chatId || !author) throw new MissingFieldsError("Missing id fields");
  const rs = await getByAuthorAndChatId(
    mongoose.Types.ObjectId(author),
    mongoose.Types.ObjectId(chatId)
  );
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get message by author and chat room id",
  });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) throw new MissingFieldsError("Missing id field");
  const rs = await deleteById(mongoose.Types.ObjectId(id));
  return res.status(200).json({
    status: rs ? "success" : "failure",
  });
});

const updateMessage = asyncHandler(async (req, res) => {
  if (!req.body._id || !req.body.content)
    throw new MissingFieldsError("Missing inputs");
  const rs = await update(req.body);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot update message",
  });
});

module.exports = {
  createMessage,
  getMessageById,
  getMessageByAuthor,
  deleteMessage,
  updateMessage,
  getMessageByAuthorAndChatId,
  getMessagesFromChat,
};
