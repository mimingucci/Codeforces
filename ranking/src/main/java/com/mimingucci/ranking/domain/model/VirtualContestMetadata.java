package com.mimingucci.ranking.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VirtualContestMetadata {
    private Long contestId;

    private Long userId;

    private Instant startTime;

    private Instant endTime;
}
