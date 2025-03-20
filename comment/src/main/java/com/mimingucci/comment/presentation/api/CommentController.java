package com.mimingucci.comment.presentation.api;

import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.BaseResponse;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface CommentController {

    BaseResponse<CommentResponse> createComment(CommentCreateRequest request, HttpServletRequest httpRequest);

    BaseResponse<CommentResponse> updateComment(Long id, CommentUpdateRequest request, HttpServletRequest httpRequest);
}
