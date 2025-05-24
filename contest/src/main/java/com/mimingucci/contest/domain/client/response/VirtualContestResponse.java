package com.mimingucci.contest.domain.client.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirtualContestResponse {
    private Long contestId;

    private Long userId;

    private Instant startTime;

    private Instant endTime;
}
