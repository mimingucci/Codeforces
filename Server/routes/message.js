const express = require("express");
const router = express.Router();
const controller = require("../controllers/message");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createMessage);
router.get("/get/from", controller.getMessageByAuthor);
router.get("/get/to", controller.getMessageByReceiver);
router.get("/get/fromto", controller.getMessageByAuthorAndReceiver);
router.get("/get/:id", controller.getMessageById);
router.put("/update", controller.updateMessage);
router.delete("/delete", controller.deleteMessage);
module.exports = router;
