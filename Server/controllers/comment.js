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
  if (!req.user._id) throw new MissingFieldsError("Missing author field");
  if (!req.body.blogId) throw new MissingFieldsError("Missing blog id field");
  let ok = await blogExists(mongoose.Types.ObjectId(req.body.blogId));
  if (!ok)
    throw new BlogNotFoundError("Can not find blog with id " + req.body.blogId);
  const rs = await save({
    author: req.user._id,
    blogId: req.body.blogId,
    content: req.body.content,
  });
  const addToBlog = await addComment(
    mongoose.Types.ObjectId(req.body.blogId),
    rs._id
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot create new comment",
  });
});

const getCommentsByAuthor = asyncHandler(async (req, res) => {
  const author = req.query.author;
  if (!author) throw new MissingFieldsError("Missing author field");
  const valid = await userExists({ id: mongoose.Types.ObjectId(author) });
  if (!valid) throw new UserNotFoundError(`Cannot find user with id ${author}`);
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
  if (!req.body.comment || !req.user._id)
    throw new MissingFieldsError("Missing inputs");
  const [x, z, t] = await Promise.all([
    commentExists(mongoose.Types.ObjectId(req.body.comment)),
    alreadyLike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    ),
    alreadyDislike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    ),
  ]);
  if (!x) throw new Error("Invalid inputs");
  if (z) {
    const rs = await deleteLike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    );
    return res.status(200).json({
      status: rs ? "success" : "failure",
      data: rs ? rs : "Cannot update like from comment",
    });
  }
  if (t) {
    await deleteDislike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    );
  }
  const rs = await like(
    mongoose.Types.ObjectId(req.body.comment),
    mongoose.Types.ObjectId(req.user._id)
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

const dislikeComment = asyncHandler(async (req, res) => {
  if (!req.body.comment || !req.user._id)
    throw new MissingFieldsError("Missing inputs");
  const [x, z, t] = await Promise.all([
    commentExists(mongoose.Types.ObjectId(req.body.comment)),
    alreadyLike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    ),
    alreadyDislike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    ),
  ]);
  if (!x) throw new Error("Invalid inputs");
  if (t) {
    const rs = await deleteDislike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    );
    return res.status(200).json({
      status: rs ? "success" : "failure",
      data: rs ? rs : "Cannot update dislike from comment",
    });
  }
  if (z) {
    await deleteLike(
      mongoose.Types.ObjectId(req.body.comment),
      mongoose.Types.ObjectId(req.user._id)
    );
  }
  const rs = await dislike(
    mongoose.Types.ObjectId(req.body.comment),
    mongoose.Types.ObjectId(req.user._id)
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs,
  });
});

const deleteLikeFromComment = asyncHandler(async (req, res) => {
  if (!req.body.comment || !req.user._id)
    throw new MissingFieldsError("Missing input fields");
  const rs = await deleteLike(
    mongoose.Types.ObjectId(req.body.comment),
    mongoose.Types.ObjectId(req.user._id)
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot delete like from comment",
  });
});

const deleteDislikeFromComment = asyncHandler(async (req, res) => {
  if (!req.body.comment || !req.user._id)
    throw new MissingFieldsError("Missing input fields");
  const rs = await deleteDislike(
    mongoose.Types.ObjectId(req.body.comment),
    mongoose.Types.ObjectId(req.user._id)
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot delete dislike from comment",
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
  if (!comment) throw new Error("Cannot get comment with provided id");
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
  deleteLikeFromComment,
  deleteDislikeFromComment,
};
