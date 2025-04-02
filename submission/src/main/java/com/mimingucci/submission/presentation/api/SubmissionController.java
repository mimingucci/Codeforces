package com.mimingucci.submission.presentation.api;

import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.BaseResponse;
import com.mimingucci.submission.presentation.dto.response.PageableResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

public interface SubmissionController {
    BaseResponse<SubmissionResponse> getSubmissionById(Long id);

    BaseResponse<SubmissionResponse> createSubmission(SubmissionRequest request, HttpServletRequest httpServletRequest);

    BaseResponse<PageableResponse<SubmissionResponse>> getPageSubmissionsByUserId(Long userId, Pageable pageable);
}
