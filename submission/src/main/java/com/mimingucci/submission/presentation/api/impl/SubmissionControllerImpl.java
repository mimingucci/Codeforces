package com.mimingucci.submission.presentation.api.impl;

import com.mimingucci.submission.application.SubmissionApplicationService;
import com.mimingucci.submission.common.constant.PathConstants;
import com.mimingucci.submission.presentation.api.SubmissionController;
import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.BaseResponse;
import com.mimingucci.submission.presentation.dto.response.PageableResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_SUBMISSION)
public class SubmissionControllerImpl implements SubmissionController {
    private final SubmissionApplicationService applicationService;

    @PostMapping
    @Override
    public BaseResponse<SubmissionResponse> createSubmission(@RequestBody @Validated SubmissionRequest request, HttpServletRequest httpServletRequest) {
        return BaseResponse.success(applicationService.createSubmission(request, httpServletRequest));
    }

    @GetMapping(path = PathConstants.USER_SUBMISSION)
    @Override
    public BaseResponse<PageableResponse<SubmissionResponse>> getPageSubmissionsByUserId(@PathVariable(name = "userId") Long userId, Pageable pageable) {
        return BaseResponse.success(applicationService.getPageSubmissionsByUserId(userId, pageable));
    }

    @GetMapping(path = PathConstants.SUBMISSION_ID)
    @Override
    public BaseResponse<SubmissionResponse> getSubmissionById(@PathVariable(name = "submissionId") Long submissionId) {
        return BaseResponse.success(applicationService.getSubmissionById(submissionId));
    }
}
