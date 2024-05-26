const asyncHandler = require("express-async-handler");
const Blog = require("../models/blog");
const {
  save,
  getAll,
  getByAuthor,
  getById,
  getByTag,
  deleteById,
  updateById,
  alreadyLike,
  alreadyDislike,
  like,
  dislike,
  addComment,
  deleteComment,
  addTag,
  deleteTag,
  deleteLike,
  deleteDislike,
} = require("../repositories/blog");
const { MissingFieldsError } = require("../errors/input");

const createBlog = asyncHandler(async (req, res) => {
  if (!req.body?.author)
    throw new MissingFieldsError("You must provide an author id");
  const rs = await save(req.body);
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot create new blog",
  });
});

module.exports = {
  createBlog,
};
