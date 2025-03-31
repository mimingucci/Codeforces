package com.mimingucci.problem.presentation.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProblemUpdateRequest {
    String title;

    String statement;

    String solution;

    Long timeLimit = 1000L;

    Long memoryLimit = 512000L;

    Long contest;

    Integer rating;

    Integer score;
}
