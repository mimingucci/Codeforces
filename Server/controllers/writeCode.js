const { readFile, writeFile } = require("../execute/makeFile");
const asyncHandler = require("express-async-handler");

const cpp = asyncHandler(async (req, res) => {
  const rs = await readFile(req.body.source);
  const result = await writeFile("cpp", rs);
  return res.json({
    status: result ? "success" : "failure",
  });
});

module.exports = {
  cpp,
};
