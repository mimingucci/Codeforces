package com.mimingucci.comment.domain.service.impl;

import com.mimingucci.comment.common.constant.ErrorMessageConstants;
import com.mimingucci.comment.common.exception.ApiRequestException;
import com.mimingucci.comment.domain.client.BlogClient;
import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.domain.repository.CommentRepository;
import com.mimingucci.comment.domain.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;

    private final BlogClient blogClient;

    @Override
    public Comment createComment(Comment domain) {
        if (blogClient.getBlogById(domain.getBlog()).data() == null) throw new ApiRequestException(ErrorMessageConstants.BLOG_NOT_FOUND, HttpStatus.NOT_FOUND);
        return commentRepository.createComment(domain);
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

    @Override
    public Boolean deleteById(Long id) {
        return this.commentRepository.deleteComment(id);
    }

    @Override
    public Boolean deleteByBlogId(Long blogId) {
        return this.commentRepository.deleteByBlogId(blogId);
    }

    @Override
    public Comment likeComment(Long id, Long user) {
        return this.commentRepository.likeComment(id, user);
    }

    @Override
    public Comment dislikeComment(Long id, Long user) {
        return this.commentRepository.dislikeComment(id, user);
    }

    @Override
    public Comment getById(Long id) {
        return this.commentRepository.findById(id);
    }

}
