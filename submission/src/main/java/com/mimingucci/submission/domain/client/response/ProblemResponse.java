package com.mimingucci.submission.domain.client.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
