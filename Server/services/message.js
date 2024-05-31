const { MissingFieldsError } = require("../errors/input");
const { userExists } = require("./user");
const { save } = require("../repositories/message");
const { chatExists } = require("./chat");
const createMessage = async (message) => {
  if (!message.content || !message.author || !message.chatId) {
    throw new MissingFieldsError("Missing inputs");
  }
  const [a, b] = await Promise.all([
    userExists(mongoose.Types.ObjectId(message.author)),
    chatExists(mongoose.Types.ObjectId(message.chatId)),
  ]);
  if (!a || !b) throw new Error("Invalid input");
  const rs = await save(message);
  return rs;
};

module.exports = { createMessage };
