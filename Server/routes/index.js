const errorHandler = require("../middlewares/errorHandler");
const UserRouter = require("./user");
const StateRouter = require("./state");
const CountryRouter = require("./country");
const MessageRouter = require("./message");
const BlogRouter = require("./blog");
const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/state", StateRouter);
  app.use("/api/country", CountryRouter);
  app.use("/api/message", MessageRouter);
  app.use("/api/blog", BlogRouter);
  app.use(errorHandler);
};

module.exports = initRoutes;
