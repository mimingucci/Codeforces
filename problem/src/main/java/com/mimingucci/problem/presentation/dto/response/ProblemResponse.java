package com.mimingucci.problem.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProblemResponse {
    Long id;

    String title;

    String statement;

    Boolean isPublished;

    Long author;

    String solution;

    Long contest;

    Long timeLimit = 1000L;

    Long memoryLimit = 512_000_000L;

    List<String> tags;

    Integer rating;

    Integer score;
}
