const { getById } = require("../repositories/comment");

const commentExists = async (id) => {
  const rs = await getById(id);
  if (rs && rs._id.toString() === id.toString()) {
    return true;
  } else {
    return false;
  }
};

module.exports = { commentExists };
