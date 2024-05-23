const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
