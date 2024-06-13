const Message = require("../models/message");

const save = async (data) => {
  const message = new Message({
    content: data.content,
    author: data.author,
    chat: data.chat,
  });
  const rs = await message.save();
  return rs;
};

const getById = async (id) => {
  const rs = await Message.findById(id);
  return rs;
};

const getByAuthor = async (author) => {
  const rs = await Message.find({ author }).populate({
    path: "author",
    model: "User",
    select: "username",
  });
  return rs;
};

const getByChat = async (chat) => {
  return await Message.find({ chat }).sort("-createdAt").limit(100).populate({
    path: "author",
    model: "User",
    select: "username",
  });
};

const getByAuthorAndChat = async ({ author, chat }) => {
  return await Message.findOne({ author, chat });
};

const deleteById = async (id) => {
  const rs = await Message.findByIdAndDelete(id);
  return rs ? true : false;
};

const update = async (data) => {
  const rs = await Message.findByIdAndUpdate(
    data._id,
    {
      content: data.content,
    },
    { new: true }
  );
  return rs;
};

module.exports = {
  save,
  getById,
  getByAuthor,
  getByChat,
  getByAuthorAndChat,
  deleteById,
  update,
};
