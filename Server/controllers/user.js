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
  getByState,
  getByCountry,
  setCountry,
  setState,
  unsetCountry,
  unsetState,
  updatePassword,
} = require("../repositories/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const sendMail = require("../untils/sendMail");
const { default: mongoose } = require("mongoose");
const {
  signToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");

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
    const newUser = await save({ username, email, password });
    const token = signToken({
      _id: newUser._id,
      email: newUser.email,
    });
    const resEmail = await sendMail({
      email,
      subject: "Verify email",
      html: `<h1>Hello, ${username}</h1>, we <a href="${process.env.URL_REACT_APP}">Codeforces</a> received request to sign up from you, please click on below link to continue sign up process!!! <br/><a href="${process.env.URL_REACT_APP}/verify-email?token=${token}">Verify Email</a>`,
    });
    return res.status(200).json({
      status: newUser ? "success" : "failure",
      data: newUser
        ? "Please check email to verify account!!!"
        : "Something went wrong",
    });
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(403).json({
      status: "failure",
      data: "Missing token",
    });
  try {
    let decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decode) => {
        if (err)
          return res.status(401).json({
            success: false,
            message: "Invalid access token",
          });
        return decode;
      }
    );
    if (!decodedData._id || !decodedData.email)
      return res.status(403).json({
        status: "failure",
        data: "Token invalid",
      });
    const user = await getById(mongoose.Types.ObjectId(decodedData._id));
    if (user.email === decodedData.email) {
      await update(mongoose.Types.ObjectId(decodedData._id), { enabled: true });
      return res.status(200).json({
        status: "success",
      });
    }
    return res.status(403).json({
      status: "failure",
      data: "Something went wrong",
    });
  } catch (error) {
    return res.status(403).json({
      status: "failure",
      data: error,
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
  if (!response.enabled) {
    return res.json({
      status: "failure",
      data: "Email is invalid",
    });
  }
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
      secure: true,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
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
  const rs = jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  const accessToken = generateAccessToken(response._id, response.role);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    data: response ? accessToken : "Refresh token not matched",
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
  res.clearCookie("accessToken", {
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
    data: rs,
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
    data: user ? "Updated password" : "Something went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.body || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(
    mongoose.Types.ObjectId(id),
    req.body,
    {
      new: true,
    }
  ).select("-password -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Some thing went wrong",
  });
});

const updateUserPassword = asyncHandler(async (req, res) => {
  if (!req.body.password || req.body.password.length == 0)
    return res.status(401).json({
      status: "failure",
      data: "Invalid password",
    });
  const rs = await updatePassword(
    mongoose.Types.ObjectId(req.user._id),
    req.body.password
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const getUsersByState = asyncHandler(async (req, res) => {
  const state = req.query.state;
  const rs = await getByState(mongoose.Types.ObjectId(state));
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const getUsersByCountry = asyncHandler(async (req, res) => {
  const country = req.query.country;
  const rs = await getByCountry(mongoose.Types.ObjectId(country));
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const updateUserByAddress = asyncHandler(async (req, res) => {
  const { country, state, id } = req.params;
  if (!id) throw new Error("Missing user id");
  ok = true;
  if (country) {
    ok = await setCountry(id, mongoose.Types.ObjectId(country));
  }
  if (state) {
    ok = await setState(id, mongoose.Types.ObjectId(state));
  }
  return res.json({
    status: ok ? "success" : "failure",
  });
});

const unsetAddress = asyncHandler(async (req, res) => {
  const country = req.query.country;
  const state = req.query.state;
  const { id } = req.params.id;
  ok = true;
  if (country && country === "true") {
    ok = await unsetCountry(mongoose.Types.ObjectId(id));
  }
  if (state && state === "true") {
    ok = await unsetState(mongoose.Types.ObjectId(id));
  }
  return res.json({
    status: ok ? "success" : "failure",
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
  getUsersByCountry,
  getUsersByState,
  updateUserByAddress,
  unsetAddress,
  verifyEmail,
  updateUserPassword,
  updateUserByAdmin,
};
