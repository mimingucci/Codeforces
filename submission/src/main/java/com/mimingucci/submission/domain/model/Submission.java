package com.mimingucci.submission.domain.model;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.common.enums.SubmissionVerdict;
import lombok.Data;

import java.time.Instant;

@Data
public class Submission {
    private Long id;

    private Long author;

    private Long problem;

    private Long contest;

    private String sourceCode;

    private SubmissionVerdict verdict;

    private Instant sent;

    private Instant judged;

    private SubmissionLanguage language;
}
