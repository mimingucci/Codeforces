package com.mimingucci.contest.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestActionEvent {
    Long id;

    Instant startTime;

    Instant endTime;
}
