package com.mimingucci.contest.domain.broker.producer;

import com.mimingucci.contest.domain.event.ContestActionEvent;

public interface ContestProducer {
    void sendContestActionEvent(ContestActionEvent event);
}
