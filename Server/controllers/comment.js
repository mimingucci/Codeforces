const { default: mongoose } = require("mongoose");
const { MissingFieldsError } = require("../errors/input");
const {
  save,
  getById,
  getByAuthor,
  update,
  deleteById,
  like,
  dislike,
  alreadyLike,
  alreadyDislike,
} = require("../repositories/comment");
const { commentExistsx } = require("../services/comment");
const { userExists } = require("../services/user");
const asyncHandler = require("express-async-handler");
const { UserNotFoundError } = require("../errors/user");
const { blogExists } = require("../services/blog");
const { BlogNotFoundError } = require("../errors/blog");
const { addComment } = require("../repositories/blog");

const createComment = asyncHandler(async (req, res) => {
  if (!req.body?.author) throw new MissingFieldsError("Missing author field");
  if (!req.body?.blogId) throw new MissingFieldsError("Missing blog id field");
  let ok = await userExists(mongoose.Types.ObjectId(req.body.author));
  if (!ok)
    throw new UserNotFoundError(
      "Can not find author with id " + req.body.author
    );
  ok = await blogExists(mongoose.Types.ObjectId(req.body.blogId));
  if (!ok)
    throw new BlogNotFoundError("Can not find blog with id " + req.body.blogId);
  const rs = await save(req.body);
  const addToBlog = await addComment(
    mongoose.Types.ObjectId(req.body.blogId),
    rs._id
  );
  return res.json({
    status:
      rs.toString() === addToBlog.author.toString() ? "success" : "failure",
    data:
      rs.toString() === addToBlog.author.toString()
        ? rs
        : "Cannot create new comment",
  });
});

const getCommentsByAuthor = asyncHandler(async (req, res) => {
  const { author } = req.params;
  const rs = await getByAuthor(mongoose.Types.ObjectId(author));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

const getCommentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rs = await getById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

module.exports = {
  createComment,
  getCommentsByAuthor,
  getCommentById,
};
