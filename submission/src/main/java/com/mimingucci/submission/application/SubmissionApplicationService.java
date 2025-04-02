package com.mimingucci.submission.application;

import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.PageableResponse;
import com.mimingucci.submission.presentation.dto.response.SubmissionResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

public interface SubmissionApplicationService {
    SubmissionResponse getSubmissionById(Long id);

    SubmissionResponse createSubmission(SubmissionRequest request, HttpServletRequest httpServletRequest);

    PageableResponse<SubmissionResponse> getPageSubmissionsByUserId(Long userId, Pageable pageable);
}
