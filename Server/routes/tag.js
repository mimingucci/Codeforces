const express = require("express");
const router = express.Router();
const controller = require("../controllers/tag");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createTag);
router.get("/get/name", controller.getTagByName);
router.get("/get/:id", controller.getTagById);
router.put("/update", controller.updateTagById);
router.delete("/delete/:id", controller.deleteTagById);
module.exports = router;
