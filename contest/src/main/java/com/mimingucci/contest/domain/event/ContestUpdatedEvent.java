package com.mimingucci.contest.domain.event;

import com.mimingucci.contest.domain.model.Contest;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ContestUpdatedEvent {
    private final Contest contest;
}
