const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createComment);
router.get("/get/author", controller.getCommentsByAuthor);
router.get("/get/:id", controller.getCommentById);
router.put("/update/like", controller.likeComment);
router.put("/update/dislike", controller.dislikeComment);
router.put("/update/deletelike", controller.deleteLikeFromComment);
router.put("/update/deletedislike", controller.deleteDislikeFromComment);
router.put("/update/:id", controller.updateComment);
router.delete("/delete/:id", controller.deleteCommentController);
module.exports = router;
