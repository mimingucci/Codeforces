const express = require("express");
const router = express.Router();
const controller = require("../controllers/country");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", controller.createCountry);
router.get("/get", controller.getCountryByName);
router.put("/update/add", controller.addStateToCountry);
router.put("/update/delete", controller.deleteStateToCountry);
module.exports = router;
