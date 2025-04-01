package com.mimingucci.submission.domain.event;

import com.mimingucci.submission.common.enums.SubmissionVerdict;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionJudgedEvent {
    Long id;
    SubmissionVerdict verdict;
}
