const repo = require("../repositories/problem");

const problemExists = async (id) => {
  const problem = await repo.getById(id);
  return problem ? true : false;
};

module.exports = { problemExists };
