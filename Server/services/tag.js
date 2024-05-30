const { getById } = require("../repositories/tag");

const tagExists = async (id) => {
  const rs = await getById(id);
  return rs ? true : false;
};

module.exports = { tagExists };
