package com.mimingucci.comment.presentation.api;

import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.BaseResponse;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface CommentController {

    BaseResponse<CommentResponse> createComment(CommentCreateRequest request, HttpServletRequest httpRequest);

    BaseResponse<CommentResponse> updateComment(Long id, CommentUpdateRequest request, HttpServletRequest httpRequest);

    BaseResponse<Boolean> deleteById(Long id);

    BaseResponse<Boolean> deleteByBlogId(Long blogId);

    BaseResponse<CommentResponse> getById(Long id);

    BaseResponse<List<CommentResponse>> getAllByBlog(Long blogId);

    BaseResponse<CommentResponse> likeComment(Long id, HttpServletRequest request);

    BaseResponse<CommentResponse> dislikeComment(Long id, HttpServletRequest request);
}
