const User = require("../models/user");

const save = async (user) => {
  await User.save(user);
};
