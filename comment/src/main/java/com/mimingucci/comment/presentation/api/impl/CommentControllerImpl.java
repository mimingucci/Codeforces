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

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_COMMENT)
public class CommentControllerImpl implements CommentController {
    private final CommentApplicationService commentApplicationService;



    @PostMapping
    @Override
    public BaseResponse<CommentResponse> createComment(@RequestBody @Validated CommentCreateRequest request, HttpServletRequest httpRequest) {
        return BaseResponse.success(this.commentApplicationService.create(request, httpRequest));
    }

    @PutMapping(path = PathConstants.COMMENT_ID)
    @Override
    public BaseResponse<CommentResponse> updateComment(@PathVariable(name = "commentId") Long id, @RequestBody @Validated CommentUpdateRequest request, HttpServletRequest httpRequest) {
        return BaseResponse.success(this.commentApplicationService.update(id, request, httpRequest));
    }
}
