package com.mimingucci.contest.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContestRegistration {
    private Long user;

    private Long contest;

    private Boolean rated;

    private Boolean participated;
}
