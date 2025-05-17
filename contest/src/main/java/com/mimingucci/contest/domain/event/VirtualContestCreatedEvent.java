package com.mimingucci.contest.domain.event;

import com.mimingucci.contest.domain.model.VirtualContest;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class VirtualContestCreatedEvent {
    private final VirtualContest virtualContest;
}
