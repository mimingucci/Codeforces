package com.mimingucci.contest.domain.event;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ContestDeletedEvent {
    private final Long contestId;
}
