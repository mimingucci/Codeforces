package com.mimingucci.ranking.infrastructure.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "rating_change")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RatingChangeId.class)
public class RatingChangeEntity {
    @Id
    private Long user;

    @Id
    private Long contest;

    @Column(name = "solved_problem")
    private Integer solvedProblem;

    @Column(name = "ranking")
    private Integer rank;

    @Column(name = "old_rating")
    private Integer oldRating;

    @Column(name = "new_rating")
    private Integer newRating;

    @Column(name = "rating_change")
    private Integer ratingChange;

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt; // UTC timestamp

    @Column(name = "updated_at")
    private Instant updatedAt; // UTC timestamp

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now(); // Set to current UTC time
    }
}
