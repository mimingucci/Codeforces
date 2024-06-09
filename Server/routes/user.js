const express = require("express");
const UserRouter = express.Router();
const controller = require("../controllers/user");
const { uploadCloud } = require("../config/cloudinary.config");
const {
  verifyAccessToken,
  isAdmin,
  getUserInfoByAccessToken,
} = require("../middlewares/verifyToken");

UserRouter.post("/create", controller.register);
UserRouter.post("/verify", controller.verifyEmail);
UserRouter.post("/signup", controller.register);
UserRouter.post("/login", controller.login);
UserRouter.get("/fetch", controller.fetchUser);
UserRouter.get("/reset-access-token", controller.refreshAccessToken);
UserRouter.get("/all", [verifyAccessToken, isAdmin], controller.getUsers);
UserRouter.get("/refresh-access-token", controller.refreshAccessToken);
UserRouter.get("/logout", verifyAccessToken, controller.logout);
UserRouter.get("/id/:id", controller.getUserById);
UserRouter.get("/username/:username", controller.getUserByUsername);
UserRouter.get("/email", controller.getUserByEmail);
UserRouter.get("/info", getUserInfoByAccessToken);
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
UserRouter.put(
  "/avatar",
  [verifyAccessToken],
  uploadCloud.single("avatar"),
  controller.uploadAvatar
);

UserRouter.delete(
  "/unset-avatar",
  [verifyAccessToken],
  controller.deleteAvatar
);
module.exports = UserRouter;
