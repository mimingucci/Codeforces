const express = require("express");
const router = express.Router();
const controller = require("../controllers/writeCode");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/run/cpp", controller.runCpp);
router.post("/run/java", controller.runJava);
router.post("/run/js", controller.runJs);
router.post("/run/py", controller.runPy);
module.exports = router;
