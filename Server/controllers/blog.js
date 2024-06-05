const asyncHandler = require("express-async-handler");
const Blog = require("../models/blog");
const {
  save,
  getAll,
  getByAuthor,
  getBlogById,
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
const { userExists } = require("../services/user");
const { UserNotFoundError } = require("../errors/user");
const { tagExists } = require("../services/tag");

const createBlog = asyncHandler(async (req, res) => {
  if (!req.user?._id || !req.body.title || !req.body.content)
    throw new MissingFieldsError(
      "Missing input, body must have title, content, author field"
    );
  const user = await userExists(mongoose.Types.ObjectId(req.user._id));
  if (!user) {
    throw new UserNotFoundError(
      `User with id ${req.body.author} does not exist`
    );
  }
  const rs = await save({
    author: req.user._id,
    content: req.body.content,
    title: req.body.title,
  });
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot create new blog",
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const rs = await getAll();
  return res.status(200).json({
    status: "success",
    data: rs,
  });
});

const getBlogByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new MissingFieldsError("You must provide a blog id");
  const rs = await getBlogById(mongoose.Types.ObjectId(id));
  return res.json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot find blog by id",
  });
});

const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const author = req.query.author;
  if (!author) throw new MissingFieldsError("Missing author id");
  const user = await userExists(mongoose.Types.ObjectId(author));
  if (!user) {
    throw new UserNotFoundError(`User with id ${author} does not exist`);
  }
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
  if (!blog || !user) throw new Error("Missing inputs");
  let valid = await blogExists(mongoose.Types.ObjectId(blog));
  if (!valid) throw new BlogNotFoundError(`Cannot find blog with id ${blog}`);
  valid = await userExists(mongoose.Types.ObjectId(user));
  if (!valid) throw new UserNotFoundError(`Cannot find user with id ${user}`);
  valid = await alreadyLike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  if (valid) {
    return res.json({
      status: "success",
    });
  }
  valid = await alreadyDislike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  if (valid) {
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
  if (!blog || !user) throw new Error("Missing inputs");
  let valid = await blogExists(mongoose.Types.ObjectId(blog));
  if (!valid) throw new BlogNotFoundError(`Cannot find blog with id ${blog}`);
  valid = await userExists(mongoose.Types.ObjectId(user));
  if (!valid) throw new UserNotFoundError(`Cannot find user with id ${user}`);
  valid = await alreadyDislike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  if (valid) {
    return res.json({
      status: "success",
    });
  }
  valid = await alreadyLike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  if (valid) {
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

const deleteLikeBlog = asyncHandler(async (req, res) => {
  const { blog, user } = req.body;
  if (!blog || !user) throw new Error("Missing inputs");
  let valid = await blogExists(mongoose.Types.ObjectId(blog));
  if (!valid) throw new BlogNotFoundError(`Cannot find blog with id ${blog}`);
  valid = await userExists(mongoose.Types.ObjectId(user));
  if (!valid) throw new UserNotFoundError(`Cannot find user with id ${user}`);
  valid = await alreadyLike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  if (!valid) {
    return res.status(403).json({
      status: "failure",
      message: `User with id ${user} doesn't like blog with id ${blog}`,
    });
  }
  const rs = await deleteLike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot delete like",
  });
});

const deleteDislikeBlog = asyncHandler(async (req, res) => {
  const { blog, user } = req.body;
  if (!blog || !user) throw new Error("Missing inputs");
  let valid = await blogExists(mongoose.Types.ObjectId(blog));
  if (!valid) throw new BlogNotFoundError(`Cannot find blog with id ${blog}`);
  valid = await userExists(mongoose.Types.ObjectId(user));
  if (!valid) throw new UserNotFoundError(`Cannot find user with id ${user}`);
  valid = await alreadyDislike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  if (!valid) {
    return res.status(403).json({
      status: "failure",
      message: `User with id ${user} doesn't dislike blog with id ${blog}`,
    });
  }
  const rs = await deleteDislike(
    mongoose.Types.ObjectId(blog),
    mongoose.Types.ObjectId(user)
  );
  return res.status(200).json({
    status: rs ? "success" : "failure",
    data: rs ? rs : "Cannot delete dislike",
  });
});

const addTagToBlog = asyncHandler(async (req, res) => {
  if (!req?.body?.blog) {
    throw new MissingFieldsError("Missing blog id");
  }
  let rs;
  for (let tag of req.body?.tags) {
    const has = await tagExists(mongoose.Types.ObjectId(tag));
    if (!has) throw new Error(`Cannot find tag with id ${tag}`);
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

const deleteTagFromBlog = asyncHandler(async (req, res) => {
  if (!req.body?.blog) {
    throw new MissingFieldsError("Missing blog id");
  }
  let rs;
  for (let tag of req.body?.tags) {
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
  getBlogByIdController,
  getBlogsByAuthor,
  getBlogsByTag,
  deleteBlogById,
  likeBlog,
  dislikeBlog,
  addTagToBlog,
  deleteTagFromBlog,
  updateBlogById,
  deleteLikeBlog,
  deleteDislikeBlog,
};
