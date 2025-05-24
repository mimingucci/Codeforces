package com.mimingucci.submission.domain.event;

import com.mimingucci.submission.common.enums.SubmissionVerdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionJudgedEvent {
    Long id;
    SubmissionVerdict verdict;
    Long author;
    Long contest;
    Long problem;
    Long execution_time_ms;
    Long memory_used_bytes;
    Instant judged_on;
}
