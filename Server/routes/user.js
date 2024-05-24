const express = require("express");
const UserRouter = express.Router();
const controller = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

UserRouter.post("/create", controller.register);
UserRouter.get("/all", controller.getUsers);
UserRouter.get("/id/:id", controller.getUserById);
UserRouter.get("/username/:username", controller.getUserByUsername);
UserRouter.get("/email", controller.getUserByEmail);
UserRouter.delete("/delete", controller.deleteUserById);
UserRouter.put("/update", controller.updateUser);
module.exports = UserRouter;
