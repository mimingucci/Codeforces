const { getById } = require("../repositories/user");

const userExists = async (user) => {
  const rs = await getById(user);
  if (rs && rs._id.toString() === user.toString()) {
    return true;
  } else {
    return false;
  }
};

module.exports = { userExists };
