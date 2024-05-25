const express = require("express");
const router = express.Router();
const controller = require("../controllers/state");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createState);
router.get("/get/:id", controller.getStateById);
router.delete("/delete/:id", controller.deleteStateById);
module.exports = router;
