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
  deleteLike,
  deleteDislike,
} = require("../repositories/comment");
const { commentExists } = require("../services/comment");
const { userExists } = require("../services/user");
const asyncHandler = require("express-async-handler");
const { UserNotFoundError } = require("../errors/user");
const { blogExists } = require("../services/blog");
const { BlogNotFoundError } = require("../errors/blog");
const { addComment, deleteComment } = require("../repositories/blog");
const comment = require("../models/comment");

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

const likeComment = asyncHandler(async (req, res) => {
  if (!req.body.comment || !req.body.user)
    throw new MissingFieldsError("Missing inputs");
  const [x, y, z, t] = await Promise.all([
    commentExists(req.body.comment),
    userExists(req.body.user),
    alreadyLike(req.body.comment, req.body.user),
    alreadyDislike(req.body.comment, req.body.user),
  ]);
  if (!x || !y || z) throw new Error("Invalid inputs");
  if (t) {
    await deleteDislike(req.body.comment, req.body.user);
  }
  const rs = await like(req.body.comment, req.body.user);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

const dislikeComment = asyncHandler(async (req, res) => {
  if (!req.body.comment || !req.body.user)
    throw new MissingFieldsError("Missing inputs");
  const [x, y, z, t] = await Promise.all([
    commentExists(req.body.comment),
    userExists(req.body.user),
    alreadyLike(req.body.comment, req.body.user),
    alreadyDislike(req.body.comment, req.body.user),
  ]);
  if (!x || !y || t) throw new Error("Invalid inputs");
  if (z) {
    await deleteLike(req.body.comment, req.body.user);
  }
  const rs = await dislike(req.body.comment, req.body.user);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || !req.body.content) throw new MissingFieldsError("Missing input");
  const rs = await update(mongoose.Types.ObjectId(id), req.body.content);
  return res.json({
    status: res ? "success" : "failure",
    data: rs,
  });
});

const deleteCommentController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("Missing id filed");
  const comment = await getById(mongoose.Types.ObjectId(id));
  if (!comment || comment.blogId.toString() != id)
    throw new Error("Cannot get comment with provided id");
  const rs1 = await deleteComment(
    mongoose.Types.ObjectId(comment.blogId),
    mongoose.Types.ObjectId(id)
  );
  const rs = await deleteById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
  });
});

module.exports = {
  createComment,
  getCommentsByAuthor,
  getCommentById,
  likeComment,
  dislikeComment,
  updateComment,
  deleteCommentController,
};
