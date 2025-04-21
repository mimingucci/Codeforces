package com.mimingucci.comment.presentation.api.impl;

import com.mimingucci.comment.application.CommentApplicationService;
import com.mimingucci.comment.common.constant.PathConstants;
import com.mimingucci.comment.presentation.api.CommentController;
import com.mimingucci.comment.presentation.dto.request.CommentCreateRequest;
import com.mimingucci.comment.presentation.dto.request.CommentUpdateRequest;
import com.mimingucci.comment.presentation.dto.response.BaseResponse;
import com.mimingucci.comment.presentation.dto.response.CommentResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_COMMENT)
public class CommentControllerImpl implements CommentController {
    private final CommentApplicationService commentApplicationService;

    @GetMapping(path = PathConstants.BLOG + PathConstants.BLOG_ID)
    @Override
    public BaseResponse<List<CommentResponse>> getAllByBlog(@PathVariable("blogId") Long blogId) {
        return BaseResponse.success(this.commentApplicationService.getByBlogId(blogId));
    }

    @PutMapping(path = PathConstants.COMMENT_ID + PathConstants.LIKE)
    @Override
    public BaseResponse<CommentResponse> likeComment(@PathVariable(name = "commentId") Long id, HttpServletRequest request) {
        return BaseResponse.success(this.commentApplicationService.likeComment(id, request));
    }

    @PutMapping(path = PathConstants.COMMENT_ID + PathConstants.DISLIKE)
    @Override
    public BaseResponse<CommentResponse> dislikeComment(@PathVariable(name = "commentId") Long id, HttpServletRequest request) {
        return BaseResponse.success(this.commentApplicationService.dislikeComment(id, request));
    }

    @PutMapping(path = PathConstants.COMMENT_ID)
    @Override
    public BaseResponse<CommentResponse> updateComment(@PathVariable(name = "commentId") Long id, @RequestBody @Validated CommentUpdateRequest request, HttpServletRequest httpRequest) {
        return BaseResponse.success(this.commentApplicationService.update(id, request, httpRequest));
    }

    @DeleteMapping(path = PathConstants.COMMENT_ID)
    @Override
    public BaseResponse<Boolean> deleteById(@PathVariable(name = "commentId") Long id) {
        return BaseResponse.success(this.commentApplicationService.deleteById(id));
    }

    @PostMapping
    @Override
    public BaseResponse<CommentResponse> createComment(@RequestBody @Validated CommentCreateRequest request, HttpServletRequest httpRequest) {
        return BaseResponse.success(this.commentApplicationService.create(request, httpRequest));
    }

    @DeleteMapping
    @Override
    public BaseResponse<Boolean> deleteByBlogId(@PathVariable("blogId") Long blogId) {
        return null;
    }
}
