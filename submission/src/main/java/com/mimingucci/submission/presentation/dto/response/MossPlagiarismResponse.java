package com.mimingucci.submission.presentation.dto.response;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import lombok.Data;

import java.time.Instant;

@Data
public class MossPlagiarismResponse {
    private Long id;

    private Long contestId;

    private Instant detectionTime;

    private String resultUrl;

    private SubmissionLanguage language;

    private String message;

    private String status;
}