const express = require("express");
const router = express.Router();
const controller = require("../controllers/problem");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken], controller.createProblem);
router.post("/testcase", [verifyAccessToken], controller.createTestCase);
router.get("/get/id", controller.getProblemById);
router.get("/get/all", controller.getAllProblems);
router.get("/fetch", controller.fetchProblem);
router.get("/get/testcase", controller.getAllTestCases);
router.put("/update", verifyAccessToken, controller.updateProblemById);
module.exports = router;
