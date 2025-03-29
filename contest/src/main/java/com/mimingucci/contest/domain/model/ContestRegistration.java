package com.mimingucci.contest.domain.model;

import lombok.Data;

@Data
public class ContestRegistration {
    private Long user;

    private Long contest;

    private Boolean rated;

    private Boolean participated;
}
