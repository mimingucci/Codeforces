const express = require("express");
const Router = express.Router();
const { uploadCloud } = require("../config/cloudinary.config");
const {
  verifyAccessToken,
  isAdmin,
  getUserInfoByAccessToken,
} = require("../middlewares/verifyToken");

Router.post(
  "/",
  [verifyAccessToken],
  uploadCloud.single("image"),
  async (req, res) => {
    if (!req.file.path)
      return res.json({
        status: "failure",
        data: "Something went wrong, try again later",
      });
    return res.status(200).json({
      status: "success",
      data: req.file.path,
    });
  }
);

module.exports = Router;
