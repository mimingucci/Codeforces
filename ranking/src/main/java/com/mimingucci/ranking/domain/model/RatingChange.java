package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingChange {
    private Long user;

    private Long contest;

    private Integer solvedProblem;

    private Integer rank;

    private Integer oldRating;

    private Integer newRating;

    private Integer ratingChange;
}
