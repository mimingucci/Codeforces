const express = require("express");
const ChatRouter = express.Router();
const controller = require("../controllers/chat");
const { uploadCloud } = require("../config/cloudinary.config");
const {
  verifyAccessToken,
  isAdmin,
  getUserInfoByAccessToken,
  enabledAccess,
} = require("../middlewares/verifyToken");

ChatRouter.post("/create", [verifyAccessToken], controller.createChat);

module.exports = ChatRouter;
