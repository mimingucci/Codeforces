const { MissingFieldsError } = require("../errors/input");
const { userExists } = require("./user");
const { save } = require("../repositories/message");
const createMessage = async (message) => {
  if (!message.content || !message.from || !message.to) {
    throw new MissingFieldsError("Missing inputs");
  }
  const [a, b] = await Promise.all([
    userExists(mongoose.Types.ObjectId(message.from)),
    userExists(mongoose.Types.ObjectId(message.to)),
  ]);
  if (!a || !b) throw new Error("Invalid user id");
  const rs = await save(message);
  return rs;
};

module.exports = { createMessage };
