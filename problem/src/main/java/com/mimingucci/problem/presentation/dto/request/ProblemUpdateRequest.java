package com.mimingucci.problem.presentation.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProblemUpdateRequest {
    String title;

    String statement;

    String solution;

    Long timeLimit = 1000L;

    Long memoryLimit = 512_000_000L;

    Long contest;

    List<String> tags;

    Boolean isPublished;

    Integer rating;

    Integer score;
}
