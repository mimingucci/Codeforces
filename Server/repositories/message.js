const Message = require("../models/message");

const save = async (data) => {
  const message = new Message({
    content: data.content,
    from: data.from,
    to: data.to,
  });
  const rs = await message.save();
  return rs;
};

const getById = async (id) => {
  const rs = await Message.findById(id);
  return rs;
};

const getByAuthor = async (from) => {
  const rs = await Message.find({ from });
  return rs;
};

const getByReceiver = async (to) => {
  return await Message.find({ to });
};

const getByAuthorAndReceiver = async (from, to) => {
  return await Message.find({ from, to });
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
  getByReceiver,
  getByAuthorAndReceiver,
  deleteById,
  update,
};
