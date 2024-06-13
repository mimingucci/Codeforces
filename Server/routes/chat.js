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
ChatRouter.post("/add", [verifyAccessToken], controller.addChat);
ChatRouter.post("/delete", [verifyAccessToken], controller.removeChat);
ChatRouter.post("/open", [verifyAccessToken], controller.openIndividualChat);
module.exports = ChatRouter;
