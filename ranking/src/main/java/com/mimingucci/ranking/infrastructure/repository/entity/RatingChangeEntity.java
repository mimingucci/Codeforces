package com.mimingucci.ranking.infrastructure.repository.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    private Integer solvedProblem;

    private Integer rank;

    private Integer oldRating;

    private Integer newRating;

    private Integer ratingChange;
}
