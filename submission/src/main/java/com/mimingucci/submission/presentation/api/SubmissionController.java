package com.mimingucci.submission.presentation.api;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.presentation.dto.request.SubmissionRequest;
import com.mimingucci.submission.presentation.dto.request.VirtualSubmissionRequest;
import com.mimingucci.submission.presentation.dto.response.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

public interface SubmissionController {
    BaseResponse<SubmissionResponse> getSubmissionById(Long id);

    BaseResponse<SubmissionResponse> createSubmission(SubmissionRequest request, HttpServletRequest httpServletRequest);

    BaseResponse<PageableResponse<SubmissionResponse>> getPageSubmissionsByUserId(Long userId, Pageable pageable);

    BaseResponse<List<SubmissionGridResponse>> getSubmissionByDateRange(Long userId, Instant startDate, Instant endDate);

    BaseResponse<SubmissionResponse> createVirtualSubmission(VirtualSubmissionRequest request, HttpServletRequest httpServletRequest);

    BaseResponse<MossPlagiarismResponse> runMoss(Long contestId, SubmissionLanguage language, HttpServletRequest request);

    BaseResponse<MossPlagiarismResponse> getMossDetection(Long contestId, SubmissionLanguage language, HttpServletRequest request);

    BaseResponse<List<MossPlagiarismResponse>> getMossDetections(Long contestId, HttpServletRequest request);
}
