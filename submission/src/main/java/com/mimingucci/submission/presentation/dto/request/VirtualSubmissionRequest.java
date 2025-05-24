package com.mimingucci.submission.presentation.dto.request;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VirtualSubmissionRequest {
    private Long id;

    @NotNull
    private String sourceCode;

    @NotNull
    private Long problem;

    @NotNull
    private Long contest;

    @NotNull
    private Long virtualContest;

    private Long author;

    @NotNull
    @Enumerated(EnumType.STRING)
    private SubmissionLanguage language;
}
