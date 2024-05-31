const Message = require("../models/message");

const save = async (data) => {
  const message = new Message({
    content: data.content,
    author: data.author,
    chatId: data.chatId,
  });
  const rs = await message.save();
  return rs;
};

const getById = async (id) => {
  const rs = await Message.findById(id);
  return rs;
};

const getByAuthor = async (author) => {
  const rs = await Message.find({ author });
  return rs;
};

const getByChatId = async (chatId) => {
  return await Message.find({ chatId });
};

const getByAuthorAndChatId = async (author, chatId) => {
  return await Message.find({ author, chatId });
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
  getByChatId,
  getByAuthorAndChatId,
  deleteById,
  update,
};
