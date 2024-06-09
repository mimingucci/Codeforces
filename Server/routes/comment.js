const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken], controller.createComment);
router.get("/get/author", controller.getCommentsByAuthor);
router.get("/get/:id", controller.getCommentById);
router.put("/update/like", [verifyAccessToken], controller.likeComment);
router.put("/update/dislike", [verifyAccessToken], controller.dislikeComment);
router.put(
  "/update/deletelike",
  [verifyAccessToken],
  controller.deleteLikeFromComment
);
router.put(
  "/update/deletedislike",
  [verifyAccessToken],
  controller.deleteDislikeFromComment
);
router.put("/update/:id", [verifyAccessToken], controller.updateComment);
router.delete(
  "/delete/:id",
  [verifyAccessToken],
  controller.deleteCommentController
);
module.exports = router;
