package com.mimingucci.submission.domain.event;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JudgeSubmissionEvent {
    Long id;

    Long problem;

    Long contest;

    Long author;

    String sourceCode;

    Instant sent_on;

    Instant startTime;

    Instant endTime;

    String rule;

    Integer score;

    Long timeLimit;

    Long memoryLimit;

    String language;
}
