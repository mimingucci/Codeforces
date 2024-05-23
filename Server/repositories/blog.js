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
  const blogs = await Blog.find({ author: author });
  return blogs;
};

const getByTag = async (tag) => {
  const rs = await Blog.find({ tags: { $elemMatch: { name: tag } } });
  return rs;
};

const deleteById = async (_id) => {
  const rs = await Blog.findByIdAndDelete(_id);
  return rs ? true : false;
};

const updateById = async (_id, blog) => {
  const rs = await Blog.findByIdAndUpdate(_id, blog);
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
};
