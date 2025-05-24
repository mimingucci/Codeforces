package com.mimingucci.problem.infrastructure.repository.entity;

import com.mimingucci.problem.common.constant.ValidProblemRating;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemEntity {
    @Id
    private Long id;

    @NotNull
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    private String title;

    @NotNull
    @NotBlank
    private String statement;

    @NotNull
    private Long author;

    private String solution;

    @NotNull
    private Long contest;

    @Column(name = "is_published")
    private Boolean isPublished = false;

    @NotNull
    @Column(name = "time_limit", nullable = false)
    private Long timeLimit = 1000L;

    @NotNull
    @Column(name = "memory_limit", nullable = false)
    private Long memoryLimit = 512_000_000L;

    @ValidProblemRating
    private Integer rating;

    private Integer score = 0;

    private List<String> tags = new ArrayList<>();

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
