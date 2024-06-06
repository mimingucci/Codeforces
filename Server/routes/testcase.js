const express = require("express");
const router = express.Router();
const controller = require("../controllers/testcase");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/get", verifyAccessToken, controller.getTestCaseById);
router.put("/update", verifyAccessToken, controller.updateTestCaseById);
module.exports = router;
