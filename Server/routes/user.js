const express = require("express");
const UserRouter = express.Router();
const controller = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

UserRouter.post("/create", controller.register);
UserRouter.post("/verify", controller.verifyEmail);
UserRouter.post("/signup", controller.register);
UserRouter.post("/login", controller.login);
UserRouter.get("/reset-access-token", controller.refreshAccessToken);
UserRouter.get("/all", [verifyAccessToken, isAdmin], controller.getUsers);
UserRouter.get("/refresh-access-token", controller.refreshAccessToken);
UserRouter.get("/logout", verifyAccessToken, controller.logout);
UserRouter.get("/id/:id", controller.getUserById);
UserRouter.get("/username/:username", controller.getUserByUsername);
UserRouter.get("/email", controller.getUserByEmail);
UserRouter.delete(
  "/delete",
  [verifyAccessToken, isAdmin],
  controller.deleteUserById
);
UserRouter.put("/update", controller.updateUser);
UserRouter.put(
  "/update-by-admin/:id",
  [verifyAccessToken, isAdmin],
  controller.updateUserByAdmin
);
UserRouter.put(
  "/change-password",
  verifyAccessToken,
  controller.updateUserPassword
);
module.exports = UserRouter;
