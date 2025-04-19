package com.mimingucci.contest.domain.event;

import com.mimingucci.contest.common.enums.ContestEvent;
import com.mimingucci.contest.infrastructure.repository.entity.enums.ContestType;
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
    Long contest;

    Instant startTime;

    Instant endTime;

    String contestants;

    ContestEvent eventType;

    ContestType contestType;
}
