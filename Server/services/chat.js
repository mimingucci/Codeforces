const { getById } = require("../repositories/chat");

const chatExists = async (id) => {
  const rs = await getById(id);
  if (!rs || rs._id.toString() != id.toString()) {
    return false;
  }
  return true;
};

module.exports = {
  chatExists,
};
