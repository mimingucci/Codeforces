package com.mimingucci.problem.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

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

    Long memoryLimit = 512_000_000L;

    Long author;

    Integer rating;

    List<String> tags;

    Integer score;

    @NotNull
    Long contest;
}
