package com.mimingucci.comment.application.impl;

import com.mimingucci.comment.application.CommentApplicationService;
import com.mimingucci.comment.application.assembler.CommentAssembler;
import com.mimingucci.comment.common.constant.ErrorMessageConstants;
import com.mimingucci.comment.common.exception.ApiRequestException;
import com.mimingucci.comment.common.util.JwtUtil;
import com.mimingucci.comment.domain.model.Comment;
import com.mimingucci.comment.domain.service.CommentService;
import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentApplicationServiceImpl implements CommentApplicationService {
    private final CommentService service;

    private final CommentAssembler assembler;

    private final JwtUtil jwtUtil;

    @Override
    public CommentResponse create(CommentCreateRequest request, HttpServletRequest httpRequest) {
        Comment comment = this.assembler.createRequestToDomain(request);
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(httpRequest);
            comment.setAuthor(claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return this.assembler.domainToResponse(this.service.createComment(comment));
    }

    @Override
    public CommentResponse update(Long id, CommentUpdateRequest request, HttpServletRequest httpRequest) {
        Comment comment = this.assembler.updateToDomain(request);
        comment.setId(id);
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(httpRequest);
            comment.setAuthor(claims.get("id", Long.class));
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        return this.assembler.domainToResponse(this.service.updateComment(comment));
    }

    @Override
    public List<CommentResponse> getByBlogId(Long blogId) {
        return this.assembler.listToResponse(this.service.findCommentsByBlogId(blogId));
    }

    @Override
    public List<CommentResponse> getByUserId(Long userId) {
        return this.assembler.listToResponse(this.service.findCommentsByUserId(userId));
    }
}
