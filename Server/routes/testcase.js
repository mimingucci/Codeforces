const express = require("express");
const router = express.Router();
const controller = require("../controllers/testcase");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/get", controller.getTestCaseById);

module.exports = router;
