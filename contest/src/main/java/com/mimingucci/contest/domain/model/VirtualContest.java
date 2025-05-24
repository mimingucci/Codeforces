package com.mimingucci.contest.domain.model;

import lombok.Data;

import java.time.Instant;

@Data
public class VirtualContest {
    private Long id;

    private Long contest;

    private Long user;

    private Instant startTime;

    private Instant endTime;

    private Instant actualStartTime;

    private Instant actualEndTime;

}
