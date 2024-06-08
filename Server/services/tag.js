const { getById, getByName } = require("../repositories/tag");

const tagExists = async (id) => {
  const rs = await getById(id);
  return rs ? true : false;
};

const tagExistsByName = async (name) => {
  const rs = await getByName(name);
  return rs ? true : false;
};

module.exports = { tagExists, tagExistsByName };
