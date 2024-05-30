const asyncHandler = require("express-async-handler");
const {
  save,
  getById,
  getByAuthor,
  getByReceiver,
  getByAuthorAndReceiver,
  deleteById,
  update,
} = require("../repositories/message");
const { MissingFieldsError } = require("../errors/input");
const { userExists } = require("../services/user");
const { default: mongoose } = require("mongoose");

const createMessage = asyncHandler(async (req, res) => {
  if (!req.body.content || !req.body.from || !req.body.to) {
    throw new MissingFieldsError("Missing inputs");
  }
  const [a, b] = await Promise.all([
    userExists(mongoose.Types.ObjectId(req.body.from)),
    userExists(mongoose.Types.ObjectId(req.body.to)),
  ]);
  if (!a || !b) throw new Error("Invalid user id");
  const rs = await save(req.body);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
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

const getMessageByReceiver = asyncHandler(async (req, res) => {
  const receiver = req.query.to;
  if (!receiver) throw new MissingFieldsError("Missing id field");
  const rs = await getByReceiver(mongoose.Types.ObjectId(receiver));
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get message by receiver",
  });
});

const getMessageByAuthorAndReceiver = asyncHandler(async (req, res) => {
  const receiver = req.query.to;
  const author = req.query.from;
  if (!receiver || !author) throw new MissingFieldsError("Missing id fields");
  const rs = await getByAuthorAndReceiver(
    mongoose.Types.ObjectId(author),
    mongoose.Types.ObjectId(receiver)
  );
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot get message by author and receiver",
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
  getMessageByReceiver,
  getMessageByAuthorAndReceiver,
};
