const Comment = require("../models/comment");
const { CommentNotFoundError } = require("../errors/comment");
const { default: mongoose } = require("mongoose");
const save = async (data) => {
  const comment = convertDataToComment(data);
  const rs = await comment.save();
  return rs;
};

const getById = async (id) => {
  return await Comment.findById(id).populate({
    path: "author",
    model: "User",
    select: "username avatar",
  });
};

const getByAuthor = async (author) => {
  const rs = await Comment.find({ author });
  return rs;
};

const update = async (id, content) => {
  const comment = await Comment.findByIdAndUpdate(
    id,
    { content: content },
    { new: true }
  ).populate({
    path: "author",
    model: "User",
    select: "username avatar",
  });
  return comment;
};

const deleteById = async (id) => {
  const rs = await Comment.findByIdAndDelete(id);
  return rs ? true : false;
};

const convertDataToComment = (data) => {
  let comment = new Comment();
  for (let [key, value] of Object.entries(data)) {
    comment.set(key, value);
  }
  return comment;
};

const like = async (commentid, userid) => {
  const rs = await Comment.findByIdAndUpdate(
    commentid,
    {
      $push: { likes: userid },
    },
    { new: true }
  ).populate({
    path: "author",
    model: "User",
    select: "username avatar",
  });
  return rs;
};

const dislike = async (commentid, userid) => {
  const rs = await Comment.findByIdAndUpdate(
    commentid,
    {
      $push: { dislikes: userid },
    },
    { new: true }
  ).populate({
    path: "author",
    model: "User",
    select: "username avatar",
  });
  return rs;
};

const deleteLike = async (commentid, userid) => {
  const rs = await Comment.findByIdAndUpdate(
    commentid,
    {
      $pull: { likes: userid },
    },
    { new: true }
  ).populate({
    path: "author",
    model: "User",
    select: "username avatar",
  });
  return rs;
};

const deleteDislike = async (commentid, userid) => {
  const rs = await Comment.findByIdAndUpdate(
    commentid,
    {
      $pull: { dislikes: userid },
    },
    { new: true }
  ).populate({
    path: "author",
    model: "User",
    select: "username avatar",
  });
  return rs;
};

const alreadyLike = async (commentid, userid) => {
  const rs = await Comment.findOne({
    _id: commentid,
    likes: { $in: [userid] },
  });
  return rs ? true : false;
};

const alreadyDislike = async (commentid, userid) => {
  const rs = await Comment.findOne({
    _id: commentid,
    dislikes: { $in: [userid] },
  });
  return rs ? true : false;
};

module.exports = {
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
};
