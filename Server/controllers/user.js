const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
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
  getAllByAdmin,
  getAllChat,
  addToChat,
  deleteFromChat,
} = require("../repositories/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  publicId,
  cloudinaryDeleteImg,
} = require("../config/cloudinary.config");
const sendMail = require("../untils/sendMail");
const { default: mongoose } = require("mongoose");
const {
  signToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");

const fetchUser = asyncHandler(async (req, res) => {
  let queryObj = { ...req.query };
  let excludedFields = ["page", "sort", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  let query = JSON.parse(queryString);
  // Filtering
  // if (queryObj?.title) query.title = { $regex: queryObj.title, $options: "i" };
  let queryCommand = User.find(query).select(
    "-password -accessToken -refreshToken"
  );
  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  // fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  // paging
  const page = +req.query.page || 1;
  let limit = 100;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  //execute query command
  queryCommand.exec(async (err, results) => {
    if (err) throw new Error(err.message);
    const cnt = await User.find({}).countDocuments();
    return res.status(200).json({
      status: results ? "success" : "failure",
      numberOfPage: Math.ceil(cnt / 100),
      data: results ? results : "Cannot get users",
    });
  });
});

const search = asyncHandler(async (req, res) => {
  let queryObj = { ...req.query };

  let queryCommand = User.find({
    $text: { $search: req.query.username },
  }).select("-password -accessToken -refreshToken");
  // paging
  const page = +req.query.page || 1;
  let limit = 100;
  if (req.query.limit && Number.isInteger(+req.query.limit)) {
    limit = +req.query.limit;
  }
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  //execute query command
  queryCommand.exec(async (err, results) => {
    if (err) throw new Error(err.message);
    const cnt = await User.find({}).countDocuments();
    return res.status(200).json({
      status: results ? "success" : "failure",
      numberOfPage: Math.ceil(cnt / 100),
      data: results ? results : "Cannot get users",
    });
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await getAllByAdmin();
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
  if (!req.user._id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  if (req.body.oldpassword) {
    delete req.body.oldpassword;
  }
  console.log(req.body);
  const response = await update(req.user._id, req.body);
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
            status: "failure",
            data: "Invalid access token",
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
      status: "failure",
      data: "Missing inputs",
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
      status: "success",
      accessToken,
      refreshToken: newRefreshToken,
      data: userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  if (!req?.headers?.authorization?.startsWith("Bearer"))
    throw new Error("No refresh token");
  const token = req.headers.authorization.split(" ")[1];
  const rs = jwt.verify(token, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: token,
  });
  const accessToken = generateAccessToken(response._id, response.role);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: true,
  });
  return res.status(200).json({
    status: response ? "success" : "failure",
    data: response ? accessToken : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  if (!req?.headers?.authorization?.startsWith("Bearer"))
    throw new Error("No refresh token");
  const token = req.headers.authorization.split(" ")[1];
  // remove refresh token in db
  await User.findOneAndUpdate(
    { refreshToken: token },
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
    status: "success",
    data: "Logout is done",
  });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("Missing image file");
  console.log(req.file.path);
  const rs = await update(req.user._id, { avatar: req.file.path });
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot upload avatar",
  });
});

const deleteAvatar = asyncHandler(async (req, res) => {
  const user = await getById(mongoose.Types.ObjectId(req.user._id));
  if (
    user.avatar ===
    "https://res.cloudinary.com/dtov6mocw/image/upload/v1717788682/Codeforces/o5kutr4fekswjrvg7i1r.jpg"
  ) {
    return res.status(200).json({
      status: "success",
      data: "You don't set avatar",
    });
  }
  const rs = await cloudinaryDeleteImg(publicId(user.avatar));
  const updatedUser = await update(mongoose.Types.ObjectId(req.user._id), {
    avatar:
      "https://res.cloudinary.com/dtov6mocw/image/upload/v1717788682/Codeforces/o5kutr4fekswjrvg7i1r.jpg",
  });
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? "Unset avatar successfully" : "Cannot delete avatar",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Please click bollow link to change password. Link will expire in 15 minutes from now. <a href=${process.env.URL_REACT_APP}/api/auth/reset-password/${resetToken}/${email}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    status: "success",
    data: rs,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token, email } = req.body;
  if (!password || !token || !email) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  console.log(passwordResetToken);
  const user = await User.findOne({
    email,
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    status: user ? "success" : "failure",
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
    status: response ? "success" : "failure",
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

const getAllChats = asyncHandler(async (req, res) => {
  const rs = await getAllChat(req.user._id);
  return res.json({
    status: "success",
    data: rs.chats,
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
  uploadAvatar,
  deleteAvatar,
  fetchUser,
  search,
  getAllChats,
};
