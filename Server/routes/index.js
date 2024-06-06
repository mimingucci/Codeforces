const errorHandler = require("../middlewares/errorHandler");
const UserRouter = require("./user");
const StateRouter = require("./state");
const CountryRouter = require("./country");
const MessageRouter = require("./message");
const BlogRouter = require("./blog");
const TagRouter = require("./tag");
const CommentRouter = require("./comment");
const ProblemRouter = require("./problem");
const TestCaseRouter = require("./testcase");
const initRoutes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/state", StateRouter);
  app.use("/api/country", CountryRouter);
  app.use("/api/message", MessageRouter);
  app.use("/api/blog", BlogRouter);
  app.use("/api/tag", TagRouter);
  app.use("/api/comment", CommentRouter);
  app.use("/api/problem", ProblemRouter);
  app.use("/api/testcase", TestCaseRouter);
  app.use(errorHandler);
};

module.exports = initRoutes;
