package com.mimingucci.ranking.infrastructure.repository.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RatingChangeId implements Serializable {
    private Long user;
    private Long contest;
}
