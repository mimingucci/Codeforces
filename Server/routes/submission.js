const express = require("express");
const router = express.Router();
const controller = require("../controllers/submission");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/submit", [verifyAccessToken], controller.createSubmission);
router.get("/get/id", controller.getSubmissionById);
router.get("/paging", controller.pagingSubmissionByAuthor);
router.get("/get/author/:author", controller.getSubmissionByAuthor);
router.put("/update", [verifyAccessToken], controller.updateSubmission);
module.exports = router;
