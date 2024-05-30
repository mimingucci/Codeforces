const { getByIdAllFields } = require("../repositories/user");

const userExists = async (user) => {
  const rs = await getByIdAllFields(user);
  if (rs && rs._id.toString() === user.toString()) {
    return true;
  } else {
    return false;
  }
};

module.exports = { userExists };
