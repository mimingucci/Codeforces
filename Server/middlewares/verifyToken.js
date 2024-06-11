const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { getById } = require("../repositories/user");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // Bearer token
  // headers: { authorization: Bearer token}
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          status: "failure",
          data: "Invalid access token",
        });
      return decode._id;
    });
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    if (!user)
      return res.status(404).json({
        status: "failure",
        data: "User not found with token",
      });
    if (req.body.oldpassword) {
      let valid = await user.isCorrectPassword(req.body.oldpassword);
      if (!valid) {
        return res.status(401).json({
          status: "failure",
          data: "Password is not correct",
        });
      }
    }
    req.user = user;
    next();
  } else {
    return res.status(401).json({
      status: "failure",
      data: "Require authentication!!!",
    });
  }
});

const getUserInfoByAccessToken = asyncHandler(async (req, res) => {
  // Bearer token
  // headers: { authorization: Bearer token}
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          status: "failure",
          data: "Invalid access token",
        });
      return decode._id;
    });
    const user = await getById(mongoose.Types.ObjectId(id));
    if (!user)
      return res.status(404).json({
        status: "failure",
        data: "User not found with token",
      });
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    return res.status(401).json({
      status: "failure",
      data: "Require authentication!!!",
    });
  }
});

const enabledAccess = asyncHandler(async (req, res) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          status: "failure",
          data: "Invalid access token",
        });
      return decode._id;
    });
    const user = await getById(mongoose.Types.ObjectId(id));
    if (!user)
      return res.status(404).json({
        status: "failure",
        data: "User not found with token",
      });
    if (
      (req.body.username && req.body.username === user.username) ||
      (req.body.id && req.body.id === user._id.toString())
    ) {
      return res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      return res.status(401).json({
        status: "failure",
        data: "Info is not correct",
      });
    }
  } else {
    return res.status(401).json({
      status: "failure",
      data: "Require authentication!!!",
    });
  }
});

const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({
      status: "failure",
      data: "REQUIRE ADMIN ROLE",
    });
  next();
});

module.exports = {
  verifyAccessToken,
  isAdmin,
  getUserInfoByAccessToken,
  enabledAccess,
};
