package com.mimingucci.testcase.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProblemResponse {
    Long id;

    String title;

    String statement;

    Long author;

    String solution;

    Long contest;

    Long timeLimit = 1000L;

    Long memoryLimit = 512000L;

    Integer rating;

    Integer score;
}
