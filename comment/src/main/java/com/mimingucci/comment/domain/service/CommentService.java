package com.mimingucci.comment.domain.service;

import com.mimingucci.comment.domain.model.Comment;

import java.util.List;

public interface CommentService {
    Comment createComment(Comment domain);

    List<Comment> findCommentsByBlogId(Long blogId);

    List<Comment> findCommentsByUserId(Long userId);

    Comment updateComment(Comment comment);
}
