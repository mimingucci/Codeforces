const express = require("express");
const router = express.Router();
const controller = require("../controllers/problem");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createProblem);
router.post("/testcase", controller.createTestCase);
router.get("/get/id", controller.getProblemById);
router.get("/get/all", controller.getAllProblems);

module.exports = router;
