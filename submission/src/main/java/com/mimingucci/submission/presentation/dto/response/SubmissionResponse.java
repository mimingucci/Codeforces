package com.mimingucci.submission.presentation.dto.response;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.common.enums.SubmissionVerdict;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
public class SubmissionResponse {
    Long id;
    Long problem;
    Long contest;
    Long author;
    String sourceCode;
    SubmissionVerdict verdict;
    SubmissionLanguage language;
    Instant sent;
    Instant judged;
    Long execution_time_ms;
    Long memory_used_bytes;
}
