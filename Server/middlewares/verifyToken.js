const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { getById } = require("../repositories/user");
const { default: mongoose } = require("mongoose");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // Bearer token
  // headers: { authorization: Bearer token}
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    const id = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          message: "Invalid access token",
        });
      return decode._id;
    });
    const user = await getById(mongoose.Types.ObjectId(id));
    if (!user)
      return res.status(404).json({
        status: "failure",
        data: "User not found with token",
      });
    req.user = user;
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: "Require authentication!!!",
    });
  }
});

const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (role !== "admin")
    return res.status(401).json({
      success: false,
      message: "REQUIRE ADMIN ROLE",
    });
  next();
});

module.exports = { verifyAccessToken, isAdmin };
