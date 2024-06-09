const { getByIdAllFields } = require("../repositories/user");
const User = require("../models/user");
const userExists = async ({ id, add = false, del = false }) => {
  let rs = await getByIdAllFields(id);
  if (rs && rs._id.toString() === id.toString()) {
    if (add) {
      rs.contribution += 1;
      await rs.save();
    }
    if (del) {
      rs.contribution = Math.max(rs.contribution - 1, 0);
      await rs.save();
    }
    return true;
  } else {
    return false;
  }
};

module.exports = { userExists };
