const express = require("express");
const router = express.Router();
const controller = require("../controllers/message");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createMessage);
router.get("/get/author", controller.getMessageByAuthor);
router.get("/get/chat", controller.getMessagesFromChat);
router.get("/get/authorchat", controller.getMessageByAuthorAndChatId);
router.get("/get/:id", controller.getMessageById);
router.put("/update", controller.updateMessage);
router.delete("/delete", controller.deleteMessage);
module.exports = router;
