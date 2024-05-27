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
const { blogExists } = require("../services/blog");
const { commentExists } = require("../services/comment");
const { MissingFieldsError } = require("../errors/input");
const { default: mongoose } = require("mongoose");

const createBlog = asyncHandler(async (req, res) => {
  if (!req.body?.author)
    throw new MissingFieldsError("You must provide an author id");
  const rs = await save(req.body);
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot create new blog",
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const rs = await getAll();
  return res.json(200).json({
    status: "success",
    data: rs,
  });
});

const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("You must provide a blog id");
  const rs = await getById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot find blog by id",
  });
});

const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const author = req.query.author;
  if (!author) throw new MissingFieldsError("Missing author id");
  const rs = await getByAuthor(mongoose.Types.ObjectId(author));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot find blogs by author",
  });
});

const getBlogsByTag = asyncHandler(async (req, res) => {
  const tag = req.query.tag;
  if (!tag) throw new MissingFieldsError("Missing tag id");
  const rs = await getByTag(mongoose.Types.ObjectId(tag));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot find blogs by tag",
  });
});

const deleteBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("You must provide a blog id");
  const rs = await deleteById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blog, user } = req.body;
  if (!body || !user) throw new Error("Missing inputs");
  if (
    await alreadyLike(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    )
  ) {
    return res.json({
      status: "success",
    });
  }
  if (
    await alreadyDislike(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    )
  ) {
    const updated = await deleteDislike(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    );
    const rs = await like(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    );
    return res.json({
      status: rs.likes.length > updated.likes.length ? "success" : "failure",
      data:
        rs.likes.length > updated.likes.length ? rs : "Something went wrong",
    });
  }
  const rs = await like(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blog, user } = req.body;
  if (!body || !user) throw new Error("Missing inputs");
  if (
    await alreadyDislike(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    )
  ) {
    return res.json({
      status: "success",
    });
  }
  if (
    await alreadyLike(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    )
  ) {
    const updated = await deleteLike(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    );
    const rs = await dislike(
      mongoose.Types.ObjectId(blog),
      mongoose.Types.ObjectId(user)
    );
    return res.json({
      status: rs.likes.length > updated.likes.length ? "success" : "failure",
      data:
        rs.likes.length > updated.likes.length ? rs : "Something went wrong",
    });
  }
  const rs = await dislike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const addTagToBlog = asyncHandler(async (req, res) => {
  if (!req?.body?.blog) {
    throw new MissingFieldsError("Missing blog id");
  }
  let rs;
  for (let tag in req.body?.tags) {
    rs = await addTag(
      mongoose.Types.ObjectId(req.body.blog),
      mongoose.Types.ObjectId(tag)
    );
  }
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const removeTagFromBlog = asyncHandler(async (req, res) => {
  if (!req.body?.blog) {
    throw new MissingFieldsError("Missing blog id");
  }
  let rs;
  for (let tag in req.body?.tags) {
    rs = await deleteTag(
      mongoose.Types.ObjectId(req.body.blog),
      mongoose.Types.ObjectId(tag)
    );
  }
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Something went wrong",
  });
});

const updateBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new MissingFieldsError("Missing blog id");
  }
  const rs = await updateById(mongoose.Types.ObjectId(id), req.body);
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot update blog by id",
  });
});

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByAuthor,
  getBlogsByTag,
  deleteBlogById,
  likeBlog,
  dislikeBlog,
  addTagToBlog,
  removeTagFromBlog,
  updateBlogById,
};
