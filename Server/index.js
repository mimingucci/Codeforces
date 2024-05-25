const express = require("express");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const db = require("./config/db");
const initRoutes = require("./routes");
require("dotenv").config();

const app = express();
const server = createServer(app);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 1905;
db();
initRoutes(app);

server.listen(PORT, () => {
  console.log(`Hello NodeJS in port ${PORT}`);
});
