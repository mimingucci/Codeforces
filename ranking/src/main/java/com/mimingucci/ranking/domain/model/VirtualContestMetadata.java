package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VirtualContestMetadata {
    private Long id;

    private Long contest;

    private Long user;

    private Instant startTime;

    private Instant endTime;

    private Instant actualStartTime;

    private Instant actualEndTime;

    private String contestants;

    private String problemset;
}
