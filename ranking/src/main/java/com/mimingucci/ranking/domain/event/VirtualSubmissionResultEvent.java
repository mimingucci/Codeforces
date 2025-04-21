package com.mimingucci.ranking.domain.event;

import com.mimingucci.ranking.common.enums.ContestType;
import com.mimingucci.ranking.common.enums.SubmissionType;
import com.mimingucci.ranking.common.enums.SubmissionVerdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VirtualSubmissionResultEvent {
    Long id;

    SubmissionVerdict verdict;

    Long author;

    Long contest;

    Long problem;

    Long execution_time_ms;

    Long memory_used_bytes;

    Integer score;

    Instant sent_on;

    Instant judged_on;

    Instant startTime;

    Instant endTime;

    SubmissionType eventType;

    ContestType contestType;

    String contestants;

    String problemset;

    Long user;
}
