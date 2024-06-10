const asyncHanlder = require("express-async-handler");
const { getByCode, save, deleteByCode } = require("../repositories/language");
const { MissingFieldsError } = require("../errors/input");

const createLanguage = asyncHanlder(async (req, res) => {
  if (!req.body.code || !req.body.name)
    throw new MissingFieldsError("Provide name and code fileds");
  const rs = await save({ code: req.body.code, name: req.body.name });
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot create new language",
  });
});

const deleteLanguageByCode = asyncHanlder(async (req, res) => {
  const { code } = req.params;
  const rs = await deleteByCode(code);
  return res.json({
    status: rs ? "success" : "failure",
  });
});

module.exports = {
  createLanguage,
  deleteLanguageByCode,
};
