package com.mimingucci.ranking.domain.event;

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
    Long id = null;

    SubmissionVerdict verdict = null;

    Long author = null;

    Long contest = null;

    Long virtualContest = null;

    Long problem = null;

    Integer score = null;

    Instant sent_on = null;

    Instant judged_on = null;

    Instant startTime;

    Instant endTime;

    Instant actualStartTime;

    Instant actualEndTime;

    SubmissionType eventType;

    String contestants = "";

    String problemset = "";

    Long execution_time_ms;

    Long memory_used_bytes;
}
