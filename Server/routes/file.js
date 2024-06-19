const express = require("express");
const router = express.Router();
const controller = require("../controllers/writeCode");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/run/cpp", [verifyAccessToken], controller.runCpp);
router.post("/run/java", [verifyAccessToken], controller.runJava);
router.post("/run/js", [verifyAccessToken], controller.runJs);
router.post("/run/py", [verifyAccessToken], controller.runPy);
module.exports = router;
