const express = require("express");
const UserRouter = express.Router();
const controller = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

UserRouter.post("/create", controller.register);
UserRouter.post("/verify", controller.verifyEmail);
UserRouter.post("/signup", controller.register);
UserRouter.post("/login", controller.login);
UserRouter.get("/all", controller.getUsers);
UserRouter.get("/refresh-access-token", controller.refreshAccessToken);
UserRouter.get("/logout", controller.logout);
UserRouter.get("/id/:id", controller.getUserById);
UserRouter.get("/username/:username", controller.getUserByUsername);
UserRouter.get("/email", controller.getUserByEmail);
UserRouter.delete("/delete", controller.deleteUserById);
UserRouter.put("/update", controller.updateUser);
module.exports = UserRouter;
