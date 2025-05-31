package com.mimingucci.submission.domain.model;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MossDetection {
    private Long id;
    private Long contestId;
    private Instant detectionTime;
    private String resultUrl;
    private SubmissionLanguage language;
    private String status;
    private String message;
}
