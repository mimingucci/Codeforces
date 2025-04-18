package com.mimingucci.ranking.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualContestRequest {
    Long contestId;

    Long userId;

    Instant actualStartTime;

    Instant actualEndTime;

    Instant startTime;

    Instant endTime;
}
