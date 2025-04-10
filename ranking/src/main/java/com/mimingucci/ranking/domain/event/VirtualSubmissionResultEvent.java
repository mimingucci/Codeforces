package com.mimingucci.ranking.domain.event;

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
    SubmissionVerdict verdict;

    Long author;

    Long contest;

    Long problem;

    Long execution_time_ms;

    Long memory_used_kb;

    Integer score;

    Instant judged_on;
}
