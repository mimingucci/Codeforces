const asyncHandler = require("express-async-handler");
const { executeCpp } = require("../execute/cplusplus");
const { executeJava } = require("../execute/java");
const { executeJs } = require("../execute/java_script");
const { executePy } = require("../execute/python");

const runCpp = asyncHandler(async (req, res) => {
  const rs = await executeCpp(req.body.input);
  console.log(rs);
  return res.json({
    status: "success",
  });
});

const runJava = asyncHandler(async (req, res) => {
  const rs = await executeJava(req.body.input);
  console.log(rs);
  return res.json({
    status: "success",
  });
});

const runJs = asyncHandler(async (req, res) => {
  const rs = await executeJs(req.body.input);
  console.log(rs);
  return res.json({
    status: "success",
  });
});

const runPy = asyncHandler(async (req, res) => {
  const rs = await executePy(req.body.input);
  console.log(rs);
  return res.json({
    status: "success",
  });
});

module.exports = {
  runCpp,
  runJava,
  runJs,
  runPy,
};
