package com.mimingucci.submission.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JudgeVirtualSubmissionEvent {
    Long id;

    Long problem;

    Long contest;

    Long virtualContest;

    Long author;

    String sourceCode;

    Instant sent_on;

    Instant startTime;

    Instant endTime;

    Instant actualStartTime;

    Instant actualEndTime;

    String rule;

    Integer score;

    Long timeLimit;

    Long memoryLimit;

    String language;
}
