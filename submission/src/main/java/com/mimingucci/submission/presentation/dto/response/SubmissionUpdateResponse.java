package com.mimingucci.submission.presentation.dto.response;

import com.mimingucci.submission.common.enums.SubmissionVerdict;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionUpdateResponse {
    private Long id;
    private SubmissionVerdict verdict;
    private Long executionTimeMs;
    private Long memoryUsedBytes;
}
