package com.mimingucci.comment.domain.service.impl;

import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.domain.repository.CommentRepository;
import com.mimingucci.comment.domain.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;

    @Override
    public Comment createComment(Comment domain) {
        return null;
    }

    @Override
    public List<Comment> findCommentsByBlogId(Long blogId) {
        return this.commentRepository.findByBlogId(blogId);
    }

    @Override
    public List<Comment> findCommentsByUserId(Long userId) {
        return this.commentRepository.findByUserId(userId);
    }

    @Override
    public Comment updateComment(Comment comment) {
        return this.commentRepository.updateComment(comment);
    }

}
