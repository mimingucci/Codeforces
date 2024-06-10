const express = require("express");
const router = express.Router();
const controller = require("../controllers/language");
const asyncHanlder = require("express-async-handler");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const { getAll } = require("../repositories/language");

router.post("/create", [verifyAccessToken, isAdmin], controller.createLanguage);
router.delete(
  "/delete/:code",
  [verifyAccessToken, isAdmin],
  controller.deleteLanguageByCode
);
router.get(
  "/get/all",
  asyncHanlder(async (req, res) => {
    const rs = await getAll();
    return res.json({
      status: "success",
      data: rs,
    });
  })
);
// router.get("/get/author/:author", controller.getSubmissionByAuthor);
// router.put("/update", [verifyAccessToken], controller.updateSubmission);
module.exports = router;
