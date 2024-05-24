const errorHandler = require("../middlewares/errorHandler");
const UserRouter = require("./user");
const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use(errorHandler);
};

module.exports = initRoutes;
