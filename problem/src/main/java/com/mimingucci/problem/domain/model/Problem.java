package com.mimingucci.problem.domain.model;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class Problem {
    private Long id;

    private String title;

    private String statement;

    private Long author;

    private Boolean isPublished;

    private String solution;

    private Long contest;

    private Long timeLimit = 1000L;

    private Long memoryLimit = 512_000_000L;

    private List<String> tags;

    private Integer rating;

    private Integer score;

    private Instant createdAt;

    private Instant updatedAt;
}
