const Blog = require("../models/blog");
const { getById } = require("./user");

const save = async (user) => {
  let blog = new Blog({
    author: user.author,
    title: user.title,
    content: user.content,
  });
  const rs = await blog.save();
  return rs;
};

const getAll = async () => {
  return await Blog.find()
    .sort("-createdAt")
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
};

const getBlogById = async (id) => {
  return await Blog.findOne({ _id: id })
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
};

const getByAuthor = async (author) => {
  const blogs = await Blog.find({ author })
    .sort("-createdAt")
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return blogs;
};

const getByTag = async (tag) => {
  const rs = await Blog.find({ tags: { $elemMatch: { name: tag } } })
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const getByTags = async (t) => {
  const rs = await Blog.find({ tags: { $all: t } })
    .sort("-createdAt")
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const deleteById = async (id) => {
  const rs = await Blog.findByIdAndDelete(id);
  return rs ? true : false;
};

const updateById = async (id, blog) => {
  const rs = await Blog.findByIdAndUpdate(id, blog, { new: true })
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const like = async (blogid, userid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $push: {
        likes: userid,
      },
    },
    { new: true }
  )
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const dislike = async (blogid, userid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $push: {
        dislikes: userid,
      },
    },
    { new: true }
  )
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const deleteLike = async (blogid, userid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $pull: {
        likes: userid,
      },
    },
    { new: true }
  )
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const deleteDislike = async (blogid, userid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $pull: {
        dislikes: userid,
      },
    },
    { new: true }
  )
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const addTag = async (blogid, tagid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $push: {
        tags: tagid,
      },
    },
    { new: true }
  );
  return rs;
};

const deleteTag = async (blogid, tagid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $pull: {
        tags: tagid,
      },
    },
    { new: true }
  );
  return rs;
};

const alreadyLike = async (blogid, userid) => {
  const rs = await Blog.findOne({ _id: blogid, likes: { $in: [userid] } });
  return rs ? true : false;
};

const alreadyDislike = async (blogid, userid) => {
  const rs = await Blog.findOne({ _id: blogid, dislikes: { $in: [userid] } });
  return rs ? true : false;
};

const addComment = async (blogid, commentid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $push: { comments: commentid },
    },
    { new: true }
  )
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

const deleteComment = async (blogid, commentid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $pull: { comments: commentid },
    },
    { new: true }
  )
    .populate({
      path: "tags",
      model: "Tag",
    })
    .populate({ path: "author", model: "User", select: "username rating" });
  return rs;
};

module.exports = {
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
  getByTags,
};
