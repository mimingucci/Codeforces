const Blog = require("../models/blog");
const { getById } = require("./user");

const save = async (user) => {
  const blog = await Blog.save(user);
  return blog;
};

const getAll = async () => {
  return await Blog.find();
};

const getByAuthor = async (author) => {
  const blogs = await Blog.find({ author });
  return blogs;
};

const getByTag = async (tag) => {
  const rs = await Blog.find({ tags: { $elemMatch: { name: tag } } });
  return rs;
};

const deleteById = async (id) => {
  const rs = await Blog.findByIdAndDelete(id);
  return rs ? true : false;
};

const updateById = async (id, blog) => {
  const rs = await Blog.findByIdAndUpdate(id, blog);
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
  );
  return rs;
};

const dislike = async (blogid, userid) => {
  const rs = await Blog.findByIdAndUpdate(
    blogid,
    {
      $push: {
        dislikes: {
          userid,
        },
      },
    },
    { new: true }
  );
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
  );
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
  );
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
  const rs = await Blog.find({ _id: blogid, likes: { $in: [userid] } });
  return rs ? true : false;
};

const alreadyDislike = async (blogid, userid) => {
  const rs = await Blog.find({ _id: blogid, dislikes: { $in: [userid] } });
  return rs ? true : false;
};

const addComment = async (blogid, commentid) => {
  const rs = await Blog.findByIdAndUpdate(blogid, {
    comments: { $push: commentid },
  });
  return rs;
};

const deleteComment = async (blogid, commentid) => {
  const rs = await Blog.findByIdAndUpdate(blogid, {
    comments: { $pull: commentid },
  });
  return rs;
};

module.exports = {
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
};
