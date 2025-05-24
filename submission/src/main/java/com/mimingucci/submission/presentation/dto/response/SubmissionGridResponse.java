package com.mimingucci.submission.presentation.dto.response;

import com.mimingucci.submission.common.enums.SubmissionVerdict;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
public class SubmissionGridResponse {
    SubmissionVerdict verdict;
    Instant sent;
}
