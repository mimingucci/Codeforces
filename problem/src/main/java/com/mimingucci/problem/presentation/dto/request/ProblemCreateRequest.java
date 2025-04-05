package com.mimingucci.problem.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProblemCreateRequest {
    @NotNull
    @NotBlank
    String title;

    @NotNull
    @NotBlank
    String statement;

    String solution;

    Long timeLimit = 1000L;

    Long memoryLimit = 512000L;

    Long author;

    Integer rating;

    Integer score;

    @NotNull
    Long contest;
}
