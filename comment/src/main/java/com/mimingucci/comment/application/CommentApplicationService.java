package com.mimingucci.comment.application;

import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface CommentApplicationService {
    CommentResponse create(CommentCreateRequest request, HttpServletRequest httpRequest);

    CommentResponse update(Long id, CommentUpdateRequest request, HttpServletRequest httpRequest);

    List<CommentResponse> getByBlogId(Long blogId);

    List<CommentResponse> getByUserId(Long userId);

    Boolean deleteById(Long id);
}
