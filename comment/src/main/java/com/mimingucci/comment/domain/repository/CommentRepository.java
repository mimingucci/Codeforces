package com.mimingucci.comment.domain.repository;

import com.mimingucci.comment.domain.model.Comment;

import java.util.List;

public interface CommentRepository {
    Comment createComment(Comment domain);

    Comment updateComment(Comment domain);

    Boolean deleteComment(Long id);

    Comment findById(Long id);

    List<Comment> findByBlogId(Long blogId);

    List<Comment> findByUserId(Long userId);

    Boolean deleteByBlogId(Long blogId);
}
