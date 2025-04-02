package com.mimingucci.submission.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JudgeSubmissionEvent {
    Long id;

    Long problem;

    String sourceCode;
}
