package com.mimingucci.contest.infrastructure.repository.entity;

import lombok.*;

import java.io.Serializable;

// Composite key class
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ContestRegistrationId implements Serializable {
    private Long user;
    private Long contest;
}
