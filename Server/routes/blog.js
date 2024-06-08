const express = require("express");
const router = express.Router();
const controller = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken], controller.createBlog);
router.get("/getall", controller.getAllBlogs);
router.get("/get/author", controller.getBlogsByAuthor);
router.get("/get/tag", controller.getBlogsByTag);
router.get("/get/:id", controller.getBlogByIdController);
router.put("/update/like", [verifyAccessToken], controller.likeBlog);
router.put("/update/dislike", [verifyAccessToken], controller.dislikeBlog);
router.put(
  "/update/deletelike",
  [verifyAccessToken],
  controller.deleteLikeBlog
);
router.put(
  "/update/deletedislike",
  [verifyAccessToken],
  controller.deleteDislikeBlog
);
router.put("/update/addtag", [verifyAccessToken], controller.addTagToBlog);
router.put(
  "/update/deletetag",
  [verifyAccessToken],
  controller.deleteTagFromBlog
);
router.put("/update/:id", [verifyAccessToken], controller.updateBlogById);
router.delete("/delete/:id", [verifyAccessToken], controller.deleteBlogById);
module.exports = router;
