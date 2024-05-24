const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  save,
  getAll,
  getByEmail,
  getByUsername,
  getById,
  update,
  deleteById,
  deleteByEmail,
} = require("../repositories/user");
require("dotenv").config();
const sendMail = require("../untils/sendMail");

const getUsers = asyncHandler(async (req, res) => {
  const response = await getAll();
  return res.status(200).json({
    status: response ? "success" : "failure",
    data: response,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing user id");
  const response = await getById(id);
  return res.status(200).json({
    status: response ? "success" : "failure",
    data: response,
  });
});

const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) throw new Error("Missing user id");
  const response = await getByUsername(username);
  return res.status(200).json({
    status: response ? "success" : "failure",
    data: response,
  });
});

const getUserByEmail = asyncHandler(async (req, res) => {
  const email = req.query.email;
  if (!email) throw new Error("Missing user's email");
  const response = await getByEmail(email);
  return res.status(200).json({
    status: response ? "success" : "failure",
    data: response,
  });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) throw new Error("Missing user id");
  const response = await deleteById(id);
  return res.status(200).json({
    status: response ? "success" : "failure",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await update(id, req.body);
  return res.status(200).json({
    status: response ? "success" : "failure",
    data: response ? response : "Some thing went wrong",
  });
});

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password || !username)
    return res.status(400).json({
      status: "failure",
      data: "Missing inputs",
    });

  const user = await User.findOne({ email });
  if (user) throw new Error("User has existed");
  else {
    const newUser = await save(req.body);
    return res.status(200).json({
      status: newUser ? "success" : "failure",
      data: newUser
        ? "Register is successfully. Please login"
        : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      sucess: false,
      message: "Missing inputs",
    });
  // plain object
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // split password and role from response
    const { password, role, refreshToken, ...userData } = response.toObject();
    // create access token
    const accessToken = generateAccessToken(response._id, role);
    // create refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    // save refresh token to database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // save refresh token into cookie with 30 days expiration time
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get token from cookies
  const cookie = req.cookies;
  // Check token
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // remove refresh token in db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // remove refresh token in cookie browser
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout is done",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Please click bollow link to change password. Link will expire in 15 minutes from now. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "Updated password" : "Something went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!req.body || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

module.exports = {
  register,
  login,
  getUsers,
  deleteUserById,
  updateUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUserById,
  getUserByUsername,
  getUserByEmail,
};
