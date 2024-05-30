const express = require("express");
const router = express.Router();
const controller = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createBlog);
router.get("/getall", controller.getAllBlogs);
router.get("/get/author", controller.getBlogsByAuthor);
router.get("/get/tag", controller.getBlogsByTag);
router.get("/get/:id", controller.getBlogByIdController);
router.put("/update/like", controller.likeBlog);
router.put("/update/dislike", controller.dislikeBlog);
router.put("/update/deletelike", controller.deleteLikeBlog);
router.put("/update/deletedislike", controller.deleteDislikeBlog);
router.put("/update/:id", controller.updateBlogById);
router.delete("/delete/:id", controller.deleteBlogById);
module.exports = router;
