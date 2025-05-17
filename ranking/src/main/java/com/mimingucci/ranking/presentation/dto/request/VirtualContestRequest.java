package com.mimingucci.ranking.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualContestRequest {
    Long id;

    Long contest;

    Long user;

    Instant actualStartTime;

    Instant actualEndTime;

    Instant startTime;

    Instant endTime;

    String problemset;

    String contestants;
}
